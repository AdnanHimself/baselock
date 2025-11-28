import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function setupStorage() {
    const { supabaseAdmin } = await import('../lib/supabase-admin');

    console.log('Checking storage buckets...');
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }

    const bucketName = 'locked_content';
    const existingBucket = buckets.find(b => b.name === bucketName);

    if (existingBucket) {
        console.log(`Bucket '${bucketName}' already exists.`);
    } else {
        console.log(`Creating bucket '${bucketName}'...`);
        const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
            public: false, // Private bucket
            fileSizeLimit: 52428800, // 50MB limit
            allowedMimeTypes: ['image/*', 'application/pdf', 'application/zip', 'text/plain']
        });

        if (createError) {
            console.error('Error creating bucket:', createError);
        } else {
            console.log(`Bucket '${bucketName}' created successfully.`);
        }
    }
}

setupStorage();
