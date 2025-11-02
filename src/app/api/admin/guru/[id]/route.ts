import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guru = await db.guru.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true
          }
        },
        waliKelas: {
          select: {
            id: true,
            nama: true
          }
        },
        pembina: {
          select: {
            id: true,
            nama: true
          }
        },
        mapel: {
          include: {
            mapel: {
              select: {
                id: true,
                nama: true
              }
            },
            kelas: {
              select: {
                id: true,
                nama: true
              }
            }
          }
        }
      }
    });

    if (!guru) {
      return NextResponse.json(
        { error: 'Guru tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(guru);
  } catch (error) {
    console.error('Error fetching guru:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data guru' },
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
    const { nama, jabatan, email } = body;

    // Cek apakah guru ada
    const existingGuru = await db.guru.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    });

    if (!existingGuru) {
      return NextResponse.json(
        { error: 'Guru tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek duplikasi email (kecuali untuk user yang sama)
    if (email && email !== existingGuru.user?.email) {
      const duplicateUser = await db.user.findUnique({
        where: { email }
      });

      if (duplicateUser) {
        return NextResponse.json(
          { error: 'Email sudah digunakan oleh user lain' },
          { status: 400 }
        );
      }

      // Update user email
      await db.user.update({
        where: { id: existingGuru.user?.id },
        data: { email }
      });
    }

    // Update guru
    const updatedGuru = await db.guru.update({
      where: { id: params.id },
      data: {
        nama,
        jabatan: jabatan || null
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      id: updatedGuru.id,
      nama: updatedGuru.nama,
      jabatan: updatedGuru.jabatan,
      email: updatedGuru.user?.email || ''
    });
  } catch (error) {
    console.error('Error updating guru:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate guru' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek apakah guru ada
    const existingGuru = await db.guru.findUnique({
      where: { id: params.id },
      include: {
        waliKelas: true,
        pembina: true,
        mapel: true
      }
    });

    if (!existingGuru) {
      return NextResponse.json(
        { error: 'Guru tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah guru masih memiliki relasi
    if (existingGuru.waliKelas.length > 0 || existingGuru.pembina.length > 0 || existingGuru.mapel.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus guru yang masih memiliki relasi aktif' },
        { status: 400 }
      );
    }

    // Hapus user terkait
    await db.user.deleteMany({
      where: { guruId: params.id }
    });

    // Hapus guru
    await db.guru.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Guru berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting guru:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus guru' },
      { status: 500 }
    );
  }
}