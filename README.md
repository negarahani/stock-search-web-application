# stock-search-web-application
Stock Search Web Application
This web application is a single-page application (SPA) designed for searching and displaying information about stocks. It leverages modern web technologies to provide a seamless user experience.
# Key Benefits
* Single-Page Application: This application is designed as a single-page web application (SPA), providing a smooth and responsive user experience without the need for page reloads. Users can interact with different sections of the application seamlessly, enhancing usability and navigation efficiency.
* Efficient Server-Side Handling: The backend server, implemented in Python using the Flask framework, acts as a proxy pass-through for API requests. By directly returning the JSON data received from the financial APIs (such as Finnhub and Polygon), the server avoids unnecessary processing and rendering of HTML templates. This approach eliminates the overhead associated with rendering HTML templates using render_template() and ensures optimal performance.
* Client-Side Rendering: HTML and Python are not mixed on the server-side, ensuring that the application remains an Ajax-driven SPA. This approach enables efficient client-side rendering of data fetched from the APIs, allowing for dynamic updates and interactions without reloading the entire page. The separation of concerns between the frontend and backend promotes code maintainability and scalability.
# Technologies Used
* Frontend: HTML, CSS, JavaScript
* Backend: Python with Flask framework
* APIs: Finnhub API for stock data, Polygon API for chart data
# How to Use
* Clone this repository to your local machine.
* Install the necessary dependencies using pip install -r requirements.txt.
* Run the Flask application by executing python app.py.
* Access the application through your web browser at http://localhost:5000/index.html.
# Note
* API Keys: Make sure to replace the placeholder API keys (FINNHUB_API_KEY and POLYGON_API_KEY) with your own keys obtained from Finnhub and Polygon, respectively.
