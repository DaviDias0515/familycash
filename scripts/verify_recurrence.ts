
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyRecurrence() {
    console.log('Starting Verification...')

    // 1. Get a family/account/category id to use
    const { data: profile } = await supabase.from('profiles').select('family_id').limit(1).single()
    if (!profile) throw new Error('No profile found')

    const familyId = profile.family_id

    const { data: accounts } = await supabase.from('accounts').select('id').eq('family_id', familyId).limit(1)
    const accountId = accounts?.[0]?.id

    const { data: categories } = await supabase.from('categories').select('id').eq('family_id', familyId).limit(1)
    const categoryId = categories?.[0]?.id

    if (!accountId || !categoryId) throw new Error('Missing dependencies (account/category)')

    // 2. Insert a Fixed Transaction
    const amount = 123.45
    const description = 'Test Fixed Transaction ' + Date.now()

    console.log('Inserting fixed transaction...')
    const { data: inserted, error } = await supabase.from('transactions').insert({
        family_id: familyId,
        account_id: accountId,
        category_id: categoryId,
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        description,
        recurrence: 'fixed',
        status: 'pago'
    }).select().single()

    if (error) {
        console.error('Insert failed:', error)
        return
    }

    console.log('Inserted:', inserted.id)

    // 3. Wait for Trigger (should be near instant)
    await new Promise(r => setTimeout(r, 2000))

    // 4. Check for generated transactions
    const { data: generated, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('parent_id', inserted.id)

    if (fetchError) {
        console.error('Fetch failed:', fetchError)
        return
    }

    console.log(`Found ${generated.length} generated transactions.`)

    if (generated.length === 11) {
        console.log('SUCCESS: Generated 11 future transactions.')
        generated.forEach((t, i) => {
            console.log(`- [${i + 1}] Date: ${t.date}, Status: ${t.status}, Recurrence: ${t.recurrence}`)
        })
    } else {
        console.error('FAILURE: Expected 11, found ' + generated.length)
    }

    // Cleanup
    console.log('Cleaning up...')
    await supabase.from('transactions').delete().eq('id', inserted.id) // Cascade should handle children? No, I set ON DELETE SET NULL.
    // So I need to delete children first or update FK. 
    // Wait, script says "REFERENCES transactions(id) ON DELETE SET NULL".
    // So if I delete parent, children remain but parent_id becomes null.
    // I should delete children manually for cleanup.
    await supabase.from('transactions').delete().eq('parent_id', inserted.id)
    await supabase.from('transactions').delete().eq('id', inserted.id)
    console.log('Cleanup done.')
}

verifyRecurrence().catch(console.error)
