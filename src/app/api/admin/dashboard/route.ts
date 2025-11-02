import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get total counts
    const [
      totalSiswa,
      totalGuru,
      totalKelas,
      todayAbsensiSiswa,
      todayAbsensiGuru,
      monthlyStats
    ] = await Promise.all([
      // Total siswa
      db.siswa.count(),
      
      // Total guru
      db.guru.count(),
      
      // Total kelas
      db.kelas.count(),
      
      // Today's student attendance
      db.absensiSiswa.groupBy({
        by: ['status'],
        where: {
          tanggal: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999))
          }
        },
        _count: true
      }),
      
      // Today's teacher attendance
      db.absensiGuru.groupBy({
        by: ['status'],
        where: {
          tanggal: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999))
          }
        },
        _count: true
      }),
      
      // Monthly attendance statistics
      db.absensiSiswa.groupBy({
        by: ['status'],
        where: {
          tanggal: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
          }
        },
        _count: true
      })
    ]);

    // Calculate today's attendance percentage for students
    const todayTotalSiswa = todayAbsensiSiswa.reduce((sum, item) => sum + item._count, 0);
    const todayHadirSiswa = todayAbsensiSiswa.find(item => item.status === 'HADIR')?._count || 0;
    const todayAttendancePercentage = todayTotalSiswa > 0 ? Math.round((todayHadirSiswa / todayTotalSiswa) * 100) : 0;

    // Calculate monthly statistics
    const monthlyTotal = monthlyStats.reduce((sum, item) => sum + item._count, 0);
    const monthlyPercentages = {
      HADIR: monthlyStats.find(item => item.status === 'HADIR')?._count || 0,
      IZIN: monthlyStats.find(item => item.status === 'IZIN')?._count || 0,
      SAKIT: monthlyStats.find(item => item.status === 'SAKIT')?._count || 0,
      ALPHA: monthlyStats.find(item => item.status === 'ALPHA')?._count || 0,
      TERLAMBAT: monthlyStats.find(item => item.status === 'TERLAMBAT')?._count || 0
    };

    // Get recent activities
    const recentActivities = await Promise.all([
      // Recent student additions
      db.siswa.findMany({
        take: 3,
        orderBy: {
          id: 'desc' // Using id as proxy for creation time since we don't have createdAt
        },
        select: {
          id: true,
          nama: true,
          nis: true,
          kelas: {
            select: {
              nama: true
            }
          }
        }
      }),
      
      // Recent attendance records
      db.absensiSiswa.findMany({
        take: 3,
        orderBy: {
          tanggal: 'desc'
        },
        select: {
          id: true,
          status: true,
          tanggal: true,
          siswa: {
            select: {
              nama: true,
              kelas: {
                select: {
                  nama: true
                }
              }
            }
          }
        }
      })
    ]);

    // Get class distribution
    const classDistribution = await db.kelas.findMany({
      select: {
        id: true,
        nama: true,
        _count: {
          select: {
            siswa: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    const dashboardData = {
      statistics: {
        totalSiswa,
        totalGuru,
        totalKelas,
        todayAttendance: {
          percentage: todayAttendancePercentage,
          present: todayHadirSiswa,
          total: todayTotalSiswa
        }
      },
      monthlyStats: {
        total: monthlyTotal,
        percentages: {
          hadir: monthlyTotal > 0 ? Math.round((monthlyPercentages.HADIR / monthlyTotal) * 100) : 0,
          izin: monthlyTotal > 0 ? Math.round((monthlyPercentages.IZIN / monthlyTotal) * 100) : 0,
          sakit: monthlyTotal > 0 ? Math.round((monthlyPercentages.SAKIT / monthlyTotal) * 100) : 0,
          alpha: monthlyTotal > 0 ? Math.round((monthlyPercentages.ALPHA / monthlyTotal) * 100) : 0,
          terlambat: monthlyTotal > 0 ? Math.round((monthlyPercentages.TERLAMBAT / monthlyTotal) * 100) : 0
        },
        counts: monthlyPercentages
      },
      recentActivities: {
        newStudents: recentActivities[0].map(student => ({
          type: 'student_added',
          message: `Siswa baru ${student.nama || 'Tanpa Nama'} (${student.nis}) ditambahkan`,
          timestamp: student.id, // Using id as timestamp proxy
          data: student
        })),
        attendance: recentActivities[1].map(record => ({
          type: 'attendance_record',
          message: `Absensi ${record.siswa.nama} - ${record.status}`,
          timestamp: record.tanggal.toISOString(),
          data: record
        }))
      },
      classDistribution
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data dashboard' },
      { status: 500 }
    );
  }
}