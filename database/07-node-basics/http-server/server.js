const http = require("http");

const PORT = 7000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });

    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>StayNest</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f5f3ff;
            text-align: center;
            padding-top: 100px;
          }

          .card {
            width: 500px;
            margin: auto;
            padding: 40px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

          h1 {
            color: #6d28d9;
            font-size: 42px;
          }

          p {
            color: #555;
            font-size: 18px;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>StayNest</h1>
          <p>PG & Hostel Finder and Management System</p>
          <p>Node.js HTTP Server is running successfully.</p>
        </div>
      </body>
      </html>
    `);
  }

  else if (req.url === "/about") {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });

    res.end(`
      <h1>About StayNest</h1>
      <p>Find comfortable PGs and hostels easily.</p>
    `);
  }

  else if (req.url === "/hostels") {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });

    res.end(`
      <h1>Available Hostels</h1>
      <p>Hostel information will be displayed here.</p>
    `);
  }

  else {
    res.writeHead(404, {
      "Content-Type": "text/html"
    });

    res.end(`
      <h1>404 - Page Not Found</h1>
      <p>The requested page does not exist.</p>
    `);
  }
});

server.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log("StayNest HTTP Server Started");
  console.log(`Server: http://localhost:${PORT}`);
  console.log("----------------------------------------");
});