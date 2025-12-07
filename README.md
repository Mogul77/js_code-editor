**📝 Next.js Code Editor Web App**

A simple web application built using Next.js that allows users to:

Write and execute JavaScript code

Automatically fix basic coding mistakes

Ask for help through a keyword-based help panel

This project was created as part of an internship assignment.

**🚀 Features**

1. Code Editor + Run Button

Users can write JavaScript inside a code editor.

Clicking Run executes the code safely using eval in a try/catch block.

Output or errors are displayed in a console section at the bottom.

2. Auto-Fix Button

Automatically fixes simple coding mistakes using custom rules:

Auto-Fix Rules Implemented

Add missing semicolons ;

Fix indentation (convert tabs to 2 spaces)

Remove extra/multiple spaces

Fix common bracket/parenthesis issues:

( → )

{ → }

[ → ]

Trim unnecessary spaces at line start/end

3. Help Panel

A help sidebar that opens when clicking the Help button.

The user can type a question and the system replies using keyword-based matching.

**Help Keywords**

Keyword	Response:
run	"Use the Run button to execute your JavaScript code…"
fix / autofix	"Auto-Fix cleans missing semicolons and indentation issues…"
error	"Check your syntax, especially missing brackets or semicolons…"
console	"All outputs and errors appear in the console section…"
default	"Sorry, I don’t understand. Try asking about run, fix, or errors."

**📂 Project Structure**
/app
   ├── page.jsx        # Main UI
   └── globals.css     # Styling
/public
README.md
package.json

**🛠️ Tech Stack**

Next.js 14+
React
JavaScript
CSS Modules / Global CSS
Hosted on Vercel

**▶️ How to Run Locally**

Clone the repository

git clone <your-repo-url>


Install dependencies

npm install


Start development server

npm run dev


Open in browser:

http://localhost:3000

**🌐 Live Demo**

🔗 Hosted Link: https://js-code-editor-seven.vercel.app/

**🎯 Deliverables Completed**

✔ Next.js project
✔ Code editor with Run button
✔ Auto-Fix feature
✔ Help panel with predefined keywords
✔ README documentation
✔ Hosted on Vercel
✔ Ready for submission
