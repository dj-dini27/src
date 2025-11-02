import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const siswa = await db.siswa.findUnique({
      where: { id: params.id },
      include: {
        kelas: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(siswa);
  } catch (error) {
    console.error('Error fetching siswa:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
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
    const { nis, nisn, email, noHP, nama, alamat, kelasId } = body;

    // Cek apakah siswa ada
    const existingSiswa = await db.siswa.findUnique({
      where: { id: params.id }
    });

    if (!existingSiswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek duplikasi (kecuali untuk siswa yang sama)
    const duplicateSiswa = await db.siswa.findFirst({
      where: {
        AND: [
          { id: { not: params.id } },
          {
            OR: [
              { nis },
              { nisn },
              { email }
            ]
          }
        ]
      }
    });

    if (duplicateSiswa) {
      let field = '';
      if (duplicateSiswa.nis === nis) field = 'NIS';
      else if (duplicateSiswa.nisn === nisn) field = 'NISN';
      else if (duplicateSiswa.email === email) field = 'Email';
      
      return NextResponse.json(
        { error: `${field} sudah digunakan oleh siswa lain` },
        { status: 400 }
      );
    }

    const updatedSiswa = await db.siswa.update({
      where: { id: params.id },
      data: {
        nis,
        nisn,
        email,
        noHP,
        nama: nama || null,
        alamat: alamat || null,
        kelasId: kelasId || null
      },
      include: {
        kelas: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    return NextResponse.json(updatedSiswa);
  } catch (error) {
    console.error('Error updating siswa:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate siswa' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek apakah siswa ada
    const existingSiswa = await db.siswa.findUnique({
      where: { id: params.id }
    });

    if (!existingSiswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus user terkait jika ada
    await db.user.deleteMany({
      where: { siswaId: params.id }
    });

    // Hapus siswa
    await db.siswa.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Siswa berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting siswa:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus siswa' },
      { status: 500 }
    );
  }
}