import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    return NextResponse.json(await fs.readFile(process.cwd() + '/datasets/ne_110m_admin_0_countries.geojson', 'utf8').then(f => JSON.parse(f)))
}