'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Seed Classes
    const classes = [
      { name: 'RPL A', createdAt: new Date(), updatedAt: new Date() },
      { name: 'RPL B', createdAt: new Date(), updatedAt: new Date() },
      { name: 'ELIND', createdAt: new Date(), updatedAt: new Date() },
      { name: 'TBSM A', createdAt: new Date(), updatedAt: new Date() },
      { name: 'TBSM B', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MEKA A', createdAt: new Date(), updatedAt: new Date() },
      { name: 'MEKA B', createdAt: new Date(), updatedAt: new Date() },
      { name: 'TKR', createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('Classes', classes, {});
    // 2. Seed Companies (Internship Placements)
    const companies = [
      {
        name: 'PT. Teknologi Nusantara',
        address: 'Jl. Merdeka No. 100, Tasikmalaya',
        sector: 'Software Engineering',
        phone: '08123456789',
        mentorName: 'Eko Prasetyo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Astra Motor Service',
        address: 'Jl. Ahmad Yani No. 50, Tasikmalaya',
        sector: 'Otomotif & TBSM',
        phone: '08987654321',
        mentorName: 'Budi Santoso',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await queryInterface.bulkInsert('Companies', companies, {});
    // 3. Seed Users (Admin, Teachers, Supervisors, Students)
    const hashedPassword = bcrypt.hashSync('password123', 10);
    const users = [
      {
        name: 'Super Admin',
        email: 'admin@pkl.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Drs. H. Mulyadi, M.Pd.',
        email: 'mulyadi@school.com',
        password: hashedPassword,
        role: 'guru',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eko Prasetyo (PT. Teknologi)',
        email: 'eko@company.com',
        password: hashedPassword,
        role: 'pembimbing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Agus Nur',
        email: 'agus@student.com',
        password: hashedPassword,
        role: 'siswa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await queryInterface.bulkInsert('Users', users, {});
    // Get the IDs of the inserted users
    const [adminUser, teacherUser, supervisorUser, studentUser] = await queryInterface.sequelize.query(
      `SELECT id, role FROM Users ORDER BY id ASC LIMIT 4;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    // Get seeded class and company ids
    const [rplAClass] = await queryInterface.sequelize.query(
      `SELECT id FROM Classes WHERE name = 'RPL A' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const [techCompany] = await queryInterface.sequelize.query(
      `SELECT id FROM Companies WHERE name LIKE '%Teknologi%' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    // 4. Seed Teacher Details
    await queryInterface.bulkInsert('Teachers', [
      {
        userId: teacherUser.id,
        nip: '197508122003121002',
        phone: '081211112222',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    // 5. Seed Supervisor Details
    await queryInterface.bulkInsert('Supervisors', [
      {
        userId: supervisorUser.id,
        companyId: techCompany.id,
        phone: '081322223333',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    // Get seeded supervisor id
    const [supervisorRecord] = await queryInterface.sequelize.query(
      `SELECT id FROM Supervisors LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    // 6. Seed Student Details
    await queryInterface.bulkInsert('Students', [
      {
        userId: studentUser.id,
        classId: rplAClass.id,
        nis: '25635711',
        phone: '081944445555',
        address: 'Perum Gading Regensi No. B4, Tasikmalaya',
        companyId: techCompany.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    // Get seeded student id
    const [studentRecord] = await queryInterface.sequelize.query(
      `SELECT id FROM Students LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    // 7. Seed Sample Attendances for Student
    await queryInterface.bulkInsert('Attendances', [
      {
        studentId: studentRecord.id,
        date: '2026-06-16',
        checkInTime: '07:30',
        checkOutTime: '17:00',
        checkInLocation: 'Tasikmalaya',
        checkOutLocation: 'Tasikmalaya',
        status: 'hadir',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: studentRecord.id,
        date: '2026-06-17',
        checkInTime: '07:45',
        checkOutTime: '17:15',
        checkInLocation: 'Tasikmalaya',
        checkOutLocation: 'Tasikmalaya',
        status: 'hadir',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    // 8. Seed Sample Journals
    await queryInterface.bulkInsert('Journals', [
      {
        studentId: studentRecord.id,
        date: '2026-06-16',
        activityDetails: 'Membuat halaman login glassmorphism untuk aplikasi PKL',
        progressPercentage: 40,
        status: 'verified',
        notes: 'Bagus, teruskan progressnya.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: studentRecord.id,
        date: '2026-06-17',
        activityDetails: 'Menghubungkan API login dengan front-end dan menguji database MySQL',
        progressPercentage: 67,
        status: 'pending',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    // 9. Seed Sample Grade
    await queryInterface.bulkInsert('Grades', [
      {
        studentId: studentRecord.id,
        supervisorId: supervisorRecord.id,
        scoreWorkAspect: 85,
        scoreBehaviorAspect: 90,
        scoreTechnicalAspect: 80,
        averageScore: 85.0,
        notes: 'Siswa bekerja keras dan menunjukkan dedikasi yang tinggi.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Grades', null, {});
    await queryInterface.bulkDelete('Journals', null, {});
    await queryInterface.bulkDelete('Attendances', null, {});
    await queryInterface.bulkDelete('Students', null, {});
    await queryInterface.bulkDelete('Supervisors', null, {});
    await queryInterface.bulkDelete('Teachers', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Companies', null, {});
    await queryInterface.bulkDelete('Classes', null, {});
  }
};
