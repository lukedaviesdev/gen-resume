# Resume PDF Generator

## Overview

This Resume PDF Generator is a Node.js script that creates professionally formatted PDF resumes from JSON data. It allows for easy customization of resume content and supports generating tailored resumes for different job applications.

## Features

- Generates a well-formatted PDF resume from JSON data
- Supports customization for different job applications
- Maintains consistent formatting and layout
- Handles dynamic content length
- Includes sections for summary, experience, skills, contract work, and education

## Prerequisites

- Node.js (v12.0.0 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone this repository or download the script files.
2. Navigate to the project directory in your terminal.
3. Install the required dependencies:

```bash
npm install pdfkit
```

## Usage

1. Prepare your resume data in a JSON file (e.g., `resume_data_default.json`).
2. Create a data folder in the root dir and place data files inside.
3. Run the script with Node.js:

```bash
node generate-resume.js [company_name]
```

If no company name is provided, it will use the default resume data.

Example:

```bash
node generate-resume.js google
```

This will generate a PDF file named `resume_google.pdf` using data from `resume_data_google.json`.

## Customizing Resume Data

Create separate JSON files for each company or version of your resume. Name them following the pattern `resume_data_[company].json`.

Example JSON structure:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "contact": {
    "phone": "Your Phone",
    "email": "Your Email",
    "address": "Your Address",
    "linkedin": "Your LinkedIn",
    "website": "Your Website",
    "workingrights": "Your Working Rights"
  },
  "summary": "Your professional summary...",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "Job Location",
      "period": "Employment Period",
      "description": "Job Description",
      "responsibilities": [
        "Responsibility 1",
        "Responsibility 2",
        ...
      ]
    },
    ...
  ],
  "skills": [
    "Skill 1",
    "Skill 2",
    ...
  ],
  "contracts": [
    {
      "company": "Contract Company",
      "period": "Contract Period",
      "description": "Contract Description"
    },
    ...
  ],
  "education": [
    {
      "year": "Graduation Year",
      "title": "Degree/Course Title",
      "description": "Education Description"
    },
    ...
  ]
}
```

## Customizing the PDF Layout

To modify the PDF layout or formatting:

1. Open `generate-resume.js` in a text editor.
2. Locate the section you want to modify (e.g., experience, skills, etc.).
3. Adjust the positioning, font sizes, or spacing as needed.

Example of modifying font size:

```javascript
doc.fontSize(12).text(resumeData.name, 50, 50);
```

## Troubleshooting

- If you encounter a "module not found" error, ensure you've installed the required dependencies with `npm install`.
- If the PDF is not generating, check that you have write permissions in the directory.
- For content overflow issues, adjust the `ensureSpace` function calls or modify the layout in the script.

## Contributing

Contributions to improve the script are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [PDFKit](http://pdfkit.org/) for PDF generation capabilities
- Inspired by the need for easily customizable, professional-looking resumes
