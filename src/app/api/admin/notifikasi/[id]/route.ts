import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notifikasi = await db.notifikasi.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!notifikasi) {
      return NextResponse.json(
        { error: 'Notifikasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(notifikasi);
  } catch (error) {
    console.error('Error fetching notifikasi:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data notifikasi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { read } = body;

    // Cek apakah notifikasi ada
    const existingNotifikasi = await db.notifikasi.findUnique({
      where: { id: params.id }
    });

    if (!existingNotifikasi) {
      return NextResponse.json(
        { error: 'Notifikasi tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedNotifikasi = await db.notifikasi.update({
      where: { id: params.id },
      data: {
        read: read !== undefined ? read : true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedNotifikasi);
  } catch (error) {
    console.error('Error updating notifikasi:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate notifikasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek apakah notifikasi ada
    const existingNotifikasi = await db.notifikasi.findUnique({
      where: { id: params.id }
    });

    if (!existingNotifikasi) {
      return NextResponse.json(
        { error: 'Notifikasi tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus notifikasi
    await db.notifikasi.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Notifikasi berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting notifikasi:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus notifikasi' },
      { status: 500 }
    );
  }
}