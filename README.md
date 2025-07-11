# Template Engines with Nunjucks

This project showcases the transformation of a static HTML template into a dynamic, content-driven blog platform utilizing **Express.js** and the **Nunjucks templating system**. It was created as a hands-on assignment for the **Advanced Web Development** program at **Spiced Academy (AWD25)**.

The primary objective was to transform the static "Clean Blog" design and restructure it into a flexible and scalable architecture. This required decomposing the original HTML markup into reusable elements (base layouts, partials, and macros) while implementing dynamic blog post generation through a centralized JSON data file.

## Features

- **Dynamic Blog Posts:** Blog content is loaded from a JSON file and rendered dynamically
- **URL Slugs:** Clean URLs for individual blog posts generated from post titles
- **Responsive Design:** Bootstrap-based responsive layout that works on all devices
- **Modular Templates:** Reusable Nunjucks templates and macros for consistent UI components
- **Contact Form:** Interactive contact form with form validation macros
- **Static Asset Serving:** Optimized serving of CSS, JavaScript, and images

## Key Concepts Demonstrated

- **Server-Side Rendering (SSR):** Using Express to render HTML on the server
- **Template Inheritance:** Creating a master layout (`_baseLayout.njk`) to maintain a consistent look and feel across all pages
- **Reusable Components with Macros:** Building modular UI components (like form inputs in `_macros.njk`) to follow the DRY principle
- **Dynamic Routing:** Creating routes in Express to serve individual blog posts based on URL slugs
- **Data-Driven Content:** Reading from a local JSON file (`blogEntries.json`) to populate the site's content dynamically
- **TypeScript Integration:** Full TypeScript support for better development experience and type safety

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Template Engine:** Nunjucks
- **Frontend:** HTML, CSS (Bootstrap 5), Vanilla JavaScript
- **Development Tools:** Nodemon, ts-node for hot reloading during development
- **Additional Libraries:**
  - `slug` - for generating URL-friendly slugs from post titles
  - `dayjs` - for date formatting and manipulation
  - `dotenv` - for environment variable management

## Project Structure

```
├── src/
│   ├── app.ts                 # Main Express application
│   ├── data/
│   │   └── blogEntries.json   # Blog post data
│   └── templates/
│       ├── _baseLayout.njk    # Master template layout
│       ├── _macros.njk        # Reusable UI macros
│       ├── home.njk           # Homepage template
│       ├── post.njk           # Individual blog post template
│       ├── about.njk          # About page template
│       └── contact.njk        # Contact page template
├── public/
│   ├── style.css              # Custom styles
│   ├── script.js              # Client-side JavaScript
│   └── images/                # Static images
├── dist/                      # Compiled JavaScript output
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nunjucks-blog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional):
   ```env
   PORT=3000
   ```

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production

Build and start the production server:

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and start production server
- `npm test` - Run tests (not implemented yet)

## Routes

- `/` - Homepage with list of all blog posts
- `/posts/:slug` - Individual blog post pages
- `/about` - About page
- `/contact` - Contact form page

## Adding New Blog Posts

To add a new blog post, edit the `src/data/blogEntries.json` file and add a new entry with the following structure:

```json
{
  "title": "Your Post Title",
  "image": "image-filename.jpg",
  "author": "Author Name",
  "createdAt": 1234567890,
  "teaser": "Short description of the post",
  "content": "<p>Full HTML content of the post</p>"
}
```

- `createdAt` should be a Unix timestamp
- `image` should be the filename of an image in the `public/images/` directory
- `content` can contain HTML markup

The system will automatically generate a URL slug from the post title.

## Customization

### Styling

Custom styles can be added to `public/style.css`. The project uses Bootstrap 5 as the base CSS framework.

### Templates

Templates are located in `src/templates/` and use Nunjucks syntax. The `_baseLayout.njk` serves as the master template that other templates extend.

### Macros

Reusable UI components are defined in `src/templates/_macros.njk` and can be imported and used in other templates.

## License

This project is licensed under the ISC License.
