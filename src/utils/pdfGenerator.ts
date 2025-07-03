import type { ResumeData } from '@/components/ResumeBuilder';

export const generatePDF = async (data: ResumeData): Promise<void> => {
  // Create a new window with the resume content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download the PDF');
    return;
  }

  const resumeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.personalInfo.fullName} - Resume</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 8px;
        }
        
        .contact-info {
          font-size: 14px;
          color: #666;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section h2 {
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        
        .item {
          margin-bottom: 15px;
        }
        
        .item-title {
          font-weight: bold;
          color: #374151;
        }
        
        .item-subtitle {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .item-description {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        
        .skill-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          border: 1px solid #d1d5db;
        }
        
        .tech-tag {
          background: #dbeafe;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          margin: 2px;
          display: inline-block;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .section {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
        <div class="contact-info">
          ${[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </div>

      ${data.careerObjective ? `
        <div class="section">
          <h2>Career Objective</h2>
          <p class="item-description">${data.careerObjective}</p>
        </div>
      ` : ''}

      ${data.education.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${data.education.map(edu => `
            <div class="item">
              <div class="item-title">${edu.degree}</div>
              <div class="item-subtitle">${edu.college} • ${edu.year}</div>
              ${edu.grade ? `<div class="item-description">Grade: ${edu.grade}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.experience.length > 0 ? `
        <div class="section">
          <h2>Professional Experience</h2>
          ${data.experience.map(exp => `
            <div class="item">
              <div class="item-title">${exp.role}</div>
              <div class="item-subtitle">${exp.company} • ${exp.duration}</div>
              <div class="item-description">${exp.description}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${(data.skills.technical.length > 0 || data.skills.soft.length > 0) ? `
        <div class="section">
          <h2>Skills</h2>
          ${data.skills.technical.length > 0 ? `
            <div class="item">
              <div class="item-title">Technical Skills</div>
              <div class="skills-container">
                ${data.skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${data.skills.soft.length > 0 ? `
            <div class="item">
              <div class="item-title">Soft Skills</div>
              <div class="skills-container">
                ${data.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${data.projects.length > 0 ? `
        <div class="section">
          <h2>Projects</h2>
          ${data.projects.map(project => `
            <div class="item">
              <div class="item-title">${project.title}</div>
              <div class="item-description">${project.description}</div>
              ${project.technologies ? `
                <div style="margin-top: 5px;">
                  ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certifications.length > 0 ? `
        <div class="section">
          <h2>Certifications</h2>
          ${data.certifications.map(cert => `
            <div class="item">
              <div class="item-title">${cert.name}</div>
              <div class="item-subtitle">${cert.issuer} • ${cert.date}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.languages.length > 0 ? `
        <div class="section">
          <h2>Languages</h2>
          <div class="skills-container">
            ${data.languages.map(language => `<span class="skill-tag">${language}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;

  printWindow.document.write(resumeHTML);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
    // Close the window after printing (optional)
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  };
};