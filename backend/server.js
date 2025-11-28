const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let submissions = [];
let submissionIdCounter = 1;

// Form schema
const formSchema = {
  title: "Employee Onboarding Form",
  description: "Please fill out this form to complete your onboarding process.",
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      validation: { minLength: 2, maxLength: 50 }
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      validation: { regex: '^[^@]+@[^@]+\\.[^@]+$' }
    },
    {
      name: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      required: false,
      validation: { min: 18, max: 100 }
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Gender',
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'interests',
      type: 'multi-select',
      label: 'Interests',
      required: false,
      options: [
        { value: 'sports', label: 'Sports' },
        { value: 'music', label: 'Music' },
        { value: 'reading', label: 'Reading' },
        { value: 'travel', label: 'Travel' }
      ],
      validation: { minSelected: 1, maxSelected: 3 }
    },
    {
      name: 'birthdate',
      type: 'date',
      label: 'Birth Date',
      required: false,
      validation: { minDate: '1900-01-01' }
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself',
      required: false,
      validation: { maxLength: 500 }
    },
    {
      name: 'newsletter',
      type: 'switch',
      label: 'Subscribe to newsletter',
      required: false
    }
  ]
};

// Validation function
function validateSubmission(data) {
  const errors = {};

  formSchema.fields.forEach(field => {
    const value = data[field.name];
    const { name, type, required, validation } = field;

    // Required check
    if (required) {
      if (type === 'multi-select' && (!value || value.length === 0)) {
        errors[name] = 'This field is required';
        return;
      }
      if (type !== 'multi-select' && !value) {
        errors[name] = 'This field is required';
        return;
      }
    }

    // Type-specific validations
    if (type === 'text' || type === 'textarea') {
      if (value && validation?.minLength && value.length < validation.minLength) {
        errors[name] = `Minimum length is ${validation.minLength}`;
      }
      if (value && validation?.maxLength && value.length > validation.maxLength) {
        errors[name] = `Maximum length is ${validation.maxLength}`;
      }
      if (value && validation?.regex && !new RegExp(validation.regex).test(value)) {
        errors[name] = 'Invalid format';
      }
    }

    if (type === 'number') {
      const numValue = value ? parseFloat(value) : null;
      if (numValue !== null && validation?.min && numValue < validation.min) {
        errors[name] = `Minimum value is ${validation.min}`;
      }
      if (numValue !== null && validation?.max && numValue > validation.max) {
        errors[name] = `Maximum value is ${validation.max}`;
      }
    }

    if (type === 'date') {
      if (value && validation?.minDate && value < validation.minDate) {
        errors[name] = `Minimum date is ${validation.minDate}`;
      }
    }

    if (type === 'multi-select') {
      if (value && validation?.minSelected && value.length < validation.minSelected) {
        errors[name] = `Select at least ${validation.minSelected} options`;
      }
      if (value && validation?.maxSelected && value.length > validation.maxSelected) {
        errors[name] = `Select at most ${validation.maxSelected} options`;
      }
    }
  });

  return errors;
}

// Routes

// GET /api/form-schema
app.get('/api/form-schema', (req, res) => {
  res.json(formSchema);
});

// POST /api/submissions
app.post('/api/submissions', (req, res) => {
  const data = req.body;
  const errors = validateSubmission(data);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  const submission = {
    id: submissionIdCounter++,
    data,
    createdAt: new Date().toISOString()
  };

  submissions.push(submission);

  res.status(201).json({
    success: true,
    id: submission.id,
    createdAt: submission.createdAt
  });
});

// GET /api/submissions
app.get('/api/submissions', (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const sortField = sortBy;
  const sortDir = sortOrder === 'asc' ? 1 : -1;

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ error: 'Invalid pagination parameters' });
  }

  let filteredSubmissions = [...submissions];

  // Sort
  filteredSubmissions.sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDir * (new Date(a.createdAt) - new Date(b.createdAt));
    }
    return 0;
  });

  const total = filteredSubmissions.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const data = filteredSubmissions.slice(start, end);

  res.json({
    data,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages
  });
});

// PUT /api/submissions/:id
app.put('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = req.body;
  const errors = validateSubmission(data);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  const index = submissions.findIndex(sub => sub.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  submissions[index].data = data;

  res.json({
    success: true,
    id: submissions[index].id,
    createdAt: submissions[index].createdAt
  });
});

// DELETE /api/submissions/:id
app.delete('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = submissions.findIndex(sub => sub.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  submissions.splice(index, 1);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});