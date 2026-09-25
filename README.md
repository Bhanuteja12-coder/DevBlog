DevBlog – Markdown Blogging CMS🛠️ 
What You Will Build

A full-featured blogging platform where users can register, write articles using Markdown syntax, view published posts with syntax highlighting, and comment or like posts. 

It also includes an admin/author dashboard to manage, edit, or delete posts.   

🚀 Core Features to Implement

User Authentication: Secure registration and login using JSON Web Tokens (JWT) and bcrypt for password hashing.   

Markdown Editor & Preview: Integrate a frontend Markdown editor (like @uiw/react-md-editor) so users can write content using markdown and see a live preview.

Relational Database Modeling (MongoDB & Mongoose): User schema (name, email, password, role).Post schema (title, slug, markdown content, author reference, tags, createdAt). Comment schema (nested relationship linking a comment to a specific post and user).

Advanced Search & Tags: Filter articles by tags, categories, or search keywords using MongoDB query operators.

Dashboard Panel: A dedicated space for authors to track their total posts, views, and manage drafts versus published content.