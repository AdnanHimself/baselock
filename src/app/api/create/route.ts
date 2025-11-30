import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    let uploadedFilePath: string | null = null;

    try {
        let slug, title, price, receiver_address, target_url, content_type;
        let file: File | null = null;

        const contentTypeHeader = req.headers.get('content-type') || '';

        // Parse request body based on Content-Type
        // Multipart/form-data is used for file uploads, JSON for text/url
        if (contentTypeHeader.includes('multipart/form-data')) {
            const formData = await req.formData();
            slug = formData.get('slug') as string;
            title = formData.get('title') as string;
            price = formData.get('price') as string;
            receiver_address = formData.get('receiver_address') as string;
            content_type = formData.get('content_type') as string;
            file = formData.get('file') as File;
        } else {
            const body = await req.json();
            slug = body.slug;
            title = body.title;
            price = body.price;
            receiver_address = body.receiver_address;
            target_url = body.target_url;
            content_type = body.content_type;
        }

        if (!slug || !price || !receiver_address) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // For text/url, target_url is required. For file/image, file is required.
        if ((content_type === 'url' || content_type === 'text') && !target_url) {
            return NextResponse.json({ error: 'Missing target content' }, { status: 400 });
        }
        if ((content_type === 'file' || content_type === 'image') && !file) {
            return NextResponse.json({ error: 'Missing file' }, { status: 400 });
        }

        if (parseFloat(price) < 1) {
            return NextResponse.json({ error: 'Price must be at least 1 USDC' }, { status: 400 });
        }

        if (parseFloat(price) > 10000) {
            return NextResponse.json({ error: 'Price cannot exceed 10,000 USDC' }, { status: 400 });
        }

        // 0. Security: Verify Wallet Signature (DoS Protection)
        // We ensure that the request comes from the owner of the wallet address
        const signature = req.headers.get('x-signature');
        const address = req.headers.get('x-address');

        if (!signature || !address) {
            return NextResponse.json({ error: 'Missing wallet signature' }, { status: 401 });
        }

        try {
            const { verifyMessage } = await import('viem');
            const isValid = await verifyMessage({
                address: address as `0x${string}`,
                message: `Create Lock: ${slug}`,
                signature: signature as `0x${string}`,
            });

            if (!isValid) {
                return NextResponse.json({ error: 'Invalid wallet signature' }, { status: 401 });
            }
        } catch (sigError) {
            console.error('Signature verification failed:', sigError);
            return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
        }

        // Handle File Upload
        if ((content_type === 'file' || content_type === 'image') && file) {
            // 1. Validate File Size (Max 50MB)
            const MAX_SIZE = 50 * 1024 * 1024; // 50MB
            if (file.size > MAX_SIZE) {
                return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 });
            }

            // Convert File to ArrayBuffer for inspection and upload
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 2. Validate File Type (Magic Numbers)
            // We check the actual file header bytes to prevent spoofing
            const { fileTypeFromBuffer } = await import('file-type');
            const type = await fileTypeFromBuffer(buffer);

            // Define allowed MIME types (Images, PDF, Audio, Video)
            const ALLOWED_MIMES = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf',
                'audio/mpeg', 'audio/wav', 'audio/x-wav',
                'video/mp4', 'video/quicktime'
            ];

            if (!type || !ALLOWED_MIMES.includes(type.mime)) {
                return NextResponse.json({ error: `Invalid file type. Allowed: Images, PDF, Audio, Video.` }, { status: 400 });
            }

            // Path: [slug]/[uuid]-[filename]
            // We use a random UUID to prevent filename collisions
            const fileName = `${slug}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

            const { error: uploadError } = await supabaseAdmin.storage
                .from('locked_content')
                .upload(fileName, buffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
            }

            uploadedFilePath = fileName;
            target_url = fileName;
        }

        // 1. Insert public metadata into 'links' table
        // This data is publicly accessible via the [shortId] page
        const { error: linkError } = await supabaseAdmin
            .from('links')
            .insert({
                id: slug,
                price: parseFloat(price),
                receiver_address: receiver_address,
                title: title || 'Unlock Content',
                token_address: '0x0000000000000000000000000000000000000000',
                created_at: new Date().toISOString(),
            });

        if (linkError) {
            console.error('Link creation error:', linkError);
            // Cleanup uploaded file if link creation fails
            if (uploadedFilePath) {
                await supabaseAdmin.storage.from('locked_content').remove([uploadedFilePath]);
            }
            return NextResponse.json({ error: 'Failed to create link metadata' }, { status: 500 });
        }

        // 2. Insert private secret into 'secrets' table
        // This data is ONLY accessible by the server after payment verification
        const { error: secretError } = await supabaseAdmin
            .from('secrets')
            .insert({
                link_id: slug,
                target_url: target_url,
                content_type: content_type || 'url',
            });

        if (secretError) {
            console.error('Secret creation error:', secretError);
            // Rollback: Delete the link if secret creation fails
            await supabaseAdmin.from('links').delete().eq('id', slug);
            // Cleanup uploaded file if secret creation fails
            if (uploadedFilePath) {
                await supabaseAdmin.storage.from('locked_content').remove([uploadedFilePath]);
            }
            return NextResponse.json({ error: 'Failed to save secret' }, { status: 500 });
        }

        return NextResponse.json({ success: true, slug });

    } catch (error) {
        console.error('Create API Error:', error);
        // Cleanup uploaded file on unexpected error
        if (uploadedFilePath) {
            await supabaseAdmin.storage.from('locked_content').remove([uploadedFilePath]);
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
