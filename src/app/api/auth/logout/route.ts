import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In a real application, you might want to:
    // 1. Invalidate the token on the server side
    // 2. Add the token to a blacklist
    // 3. Clear any server-side sessions
    
    // For now, we'll just return a success response
    // The client will handle clearing the token
    
    return NextResponse.json({
      message: 'Logout successful',
      success: true
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}