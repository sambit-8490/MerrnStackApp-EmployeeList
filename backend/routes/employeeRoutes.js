const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Use updated upload config
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  findEmployeeById
} = require('../controllers/employeeController');

// Get all employees (with search & pagination)
router.get('/', getEmployees);

// Create a new employee (with image upload)
router.post('/', upload.single('image'), createEmployee);

// Get single employee by ID
router.get('/:id', findEmployeeById);

// Update an employee (with image upload if provided)
router.put('/:id', upload.single('image'), updateEmployee);

// Delete an employee
router.delete('/:id', deleteEmployee);

module.exports = router;
