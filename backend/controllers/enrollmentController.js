const pool = require("../config/db");
const saveEnrollment = async (req, res) => {
    try {
        const {
            student_name,
            dob,
            gender,
            school_name,
            city,

            parent_name,
            relationship,
            mobile,
            whatsapp,
            email,

            class: student_class,
            curriculum,
            learning_mode,
            subjects,
            message,
            request_type
        } = req.body;
        await pool.query(
            `
            INSERT INTO enrollments
            (
                student_name,
                dob,
                gender,
                school_name,
                city,

                parent_name,
                relationship,
                mobile,
                whatsapp,
                email,

                class,
                curriculum,
                learning_mode,
                subjects,
                message,

                request_type
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
            `,
            [
                student_name,
                dob,
                gender,
                school_name,
                city,

                parent_name,
                relationship,
                mobile,
                whatsapp,
                email,

                student_class,
                curriculum,
                learning_mode,
                JSON.stringify(subjects),
                message,

                request_type
            ]
        );
        res.json({
            success: true,
            message: "Enrollment Saved Successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getEnrollments = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM enrollments ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const updateEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await pool.query(
            "UPDATE enrollments SET status = $1 WHERE id = $2",
            [status, id]
        );
        res.json({
            success: true,
            message: "Status Updated Successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const updateEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            student_name,
            parent_name,
            dob,
            gender,
            school_name,
            city,
            relationship,
            whatsapp,
            mobile,
            email,
            class: student_class,
            curriculum,
            learning_mode,
            subjects,
            message,
            request_type,
            status
        } = req.body;
        await pool.query(
            `
            UPDATE enrollments
            SET
                student_name = $1,
                parent_name = $2,
                dob = $3,
                gender = $4,
                school_name = $5,
                city = $6,
                relationship = $7,
                whatsapp = $8,
                mobile = $9,
                email = $10,
                class = $11,
                curriculum = $12,
                learning_mode = $13,
                subjects = $14,
                message = $15,
                request_type = $16,
                status = $17
            WHERE id = $18
            `,
            [
                student_name,
                parent_name,
                dob,
                gender,
                school_name,
                city,
                relationship,
                whatsapp,
                mobile,
                email,
                student_class,
                curriculum,
                learning_mode,
                JSON.stringify(subjects),
                message,
                request_type,
                status,
                id
            ]
        );
        res.json({
            success: true,
            message: "Enrollment Updated Successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            "DELETE FROM enrollments WHERE id = $1",
            [id]
        );
        res.json({
            success: true,
            message: "Enrollment Deleted Successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const total = await pool.query(
            "SELECT COUNT(*) FROM enrollments"
        );
        const pending = await pool.query(
            "SELECT COUNT(*) FROM enrollments WHERE status = 'Pending'"
        );
        const approved = await pool.query(
            "SELECT COUNT(*) FROM enrollments WHERE status = 'Approved'"
        );
        const demo = await pool.query(
            "SELECT COUNT(*) FROM enrollments WHERE request_type = 'Demo'"
        );
        res.json({
            total: Number(total.rows[0].count),
            pending: Number(pending.rows[0].count),
            approved: Number(approved.rows[0].count),
            demo: Number(demo.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM enrollments WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    saveEnrollment,
    getEnrollments,
    getEnrollmentById,
    updateEnrollmentStatus,
    deleteEnrollment,
    updateEnrollment,
    getDashboardStats
};