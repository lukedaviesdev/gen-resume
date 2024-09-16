const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
// Get the company name from command line arguments
const company = process.argv[2] || 'default';

// Load the resume data from a JSON file
let resumeData;
try {
  const dataPath = path.join(
    __dirname,
    `data/resume_data_${company.toLowerCase()}.json`
  );
  resumeData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
  console.error(`Error loading resume data for ${company}:`, error);
  process.exit(1);
}

try {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    bufferPages: true,
  });

  doc.pipe(fs.createWriteStream(`resume_${company}.pdf`));

  // Helper functions
  function drawLine(y) {
    doc.moveTo(50, y).lineTo(545, y).stroke();
  }

  function addPage() {
    doc.addPage();
    currentY = 50;
  }

  function ensureSpace(neededSpace) {
    if (currentY + neededSpace > 750) {
      addPage();
    }
  }

  function justifiedText(text, x, y, width, options = {}) {
    const { fontSize = 10, leadingSize = 4 } = options;
    doc.fontSize(fontSize);
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineY = y;

    words.forEach((word) => {
      testLine = line + word + ' ';
      const testWidth = doc.widthOfString(testLine);

      if (testWidth > width) {
        ensureSpace(fontSize + leadingSize);
        doc.text(line.trim(), x, lineY, { width: width, align: 'justify' });
        line = word + ' ';
        lineY += fontSize + leadingSize;
        currentY += fontSize + leadingSize;
      } else {
        line = testLine;
      }
    });

    ensureSpace(fontSize + leadingSize);
    doc.text(line.trim(), x, lineY, { width: width, align: 'left' });
    currentY += fontSize + leadingSize;
    return currentY;
  }

  let currentY = 50;

  // Name and Title
  doc.font('Helvetica-Bold').fontSize(24).text(resumeData.name, 50, currentY);
  currentY += 30;
  doc.font('Helvetica').fontSize(16).text(resumeData.title, 50, currentY);
  currentY += 25;

  // Contact information
  doc.fontSize(9);
  const contactInfo = [
    `Phone: ${resumeData.contact.phone}`,
    `Email: ${resumeData.contact.email}`,
    `Address: ${resumeData.contact.address}`,
    `LinkedIn: ${resumeData.contact.linkedin}`,
    `Website: ${resumeData.contact.website}`,
    `Working Rights: ${resumeData.contact.workingrights}`,
  ];

  const contactColumns = [contactInfo.slice(0, 3), contactInfo.slice(3)];
  contactColumns.forEach((column, index) => {
    column.forEach((info, i) => {
      doc.text(info, 50 + index * 250, currentY + i * 15, { width: 240 });
    });
  });
  currentY += 60;

  // Summary
  ensureSpace(60);
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('Professional Summary', 50, currentY);
  currentY += 15;
  drawLine(currentY);
  currentY += 10;
  doc.font('Helvetica').fontSize(10);
  currentY = justifiedText(resumeData.summary, 50, currentY, 495);
  currentY += 10;

  // Professional Experience
  ensureSpace(40);
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('Professional Experience', 50, currentY);
  currentY += 15;
  drawLine(currentY);
  currentY += 10;

  resumeData.experience.forEach((job) => {
    ensureSpace(60);
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(`${job.title} - ${job.company}`, 50, currentY);
    currentY += 15;
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`${job.location} | ${job.period}`, 50, currentY);
    currentY += 15;

    // Calculate space needed for description
    const descriptionHeight = doc.heightOfString(job.description, {
      width: 495,
    });
    ensureSpace(descriptionHeight + 5);
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(job.description, 50, currentY, { width: 495 });
    currentY += descriptionHeight + 5;

    job.responsibilities.forEach((resp) => {
      ensureSpace(20);
      const bulletY = currentY;
      doc.font('Helvetica').fontSize(10).text('•', 70, bulletY);
      currentY = justifiedText(resp, 85, bulletY, 460, {
        fontSize: 10,
        leadingSize: 4,
      });
    });
    currentY += 10; // Space after responsibilities
  });

  // Skills
  ensureSpace(40);
  doc.font('Helvetica-Bold').fontSize(14).text('Skills', 50, currentY);
  currentY += 15;
  drawLine(currentY);
  currentY += 10;

  const skillColumns = [[], []];
  resumeData.skills.forEach((skill, index) => {
    skillColumns[index % 2].push(skill);
  });

  const initialSkillY = currentY;
  const skillFontSize = 10;
  const skillLeading = 5;

  skillColumns.forEach((column, index) => {
    let columnY = initialSkillY;
    column.forEach((skill) => {
      ensureSpace(skillFontSize + skillLeading);
      doc.font('Helvetica').fontSize(skillFontSize);
      const skillLines = doc.heightOfString(skill, { width: 225 });
      doc.text(`• ${skill}`, 50 + index * 247, columnY, {
        width: 225,
        align: 'left',
        continued: false,
      });
      columnY += skillLines + skillLeading;
    });
    currentY = Math.max(currentY, columnY);
  });
  currentY += 10;

  // Contract Work
  ensureSpace(40);
  doc.font('Helvetica-Bold').fontSize(14).text('Contract Work', 50, currentY);
  currentY += 15;
  drawLine(currentY);
  currentY += 10;

  resumeData.contracts.forEach((contract) => {
    ensureSpace(30);
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(`${contract.company} (${contract.period})`, 50, currentY);
    currentY += 15;
    doc.font('Helvetica').fontSize(10); // Switch to regular font for description
    currentY = justifiedText(contract.description, 70, currentY, 475, {
      fontSize: 10,
      leadingSize: 4,
    });
    currentY += 10;
  });

  // Education
  ensureSpace(40);
  doc.font('Helvetica-Bold').fontSize(14).text('Education', 50, currentY);
  currentY += 15;
  drawLine(currentY);
  currentY += 10;

  resumeData.education.forEach((edu) => {
    ensureSpace(30);
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(`${edu.year} - ${edu.title}`, 50, currentY);
    currentY += 15;
    doc.font('Helvetica').fontSize(10); // Switch to regular font for description
    currentY = justifiedText(edu.description, 70, currentY, 475, {
      fontSize: 10,
      leadingSize: 4,
    });
    currentY += 10;
  });

  doc.end();

  console.log(`PDF generated successfully for ${company}!`);
} catch (error) {
  console.error('An error occurred while generating the PDF:', error);
}
