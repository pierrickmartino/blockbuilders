# BlockBuilders

## Introduction

**BlockBuilders** is a comprehensive application designed for crypto traders of all levels, from novices to professionals, to monitor and analyze the performance of their trading positions. The application offers insights into both realized and unrealized gains, and it helps users identify pain points in their trading strategies using various key performance indicators (KPIs).

### Key Features

- **Multi-Wallet Monitoring**: Users can input one or more wallet addresses, and the application will fetch the transaction history from multiple blockchains via APIs.
- **Data Aggregation and Analysis**: BlockBuilders intelligently organizes transaction data from different blockchains, providing a unified view of the user's trading activities.
- **Performance Metrics**: The application calculates and displays various KPIs, helping users identify trends, habits, and patterns in their trading behavior.
- **Scalability**: Built with scalability in mind, BlockBuilders ensures optimal performance even with large volumes of data.

### Technologies Used

- **Backend**: Python with Django framework
- **Frontend**: Bulma CSS library for styling
- **API Integration**: CryptoCompare API for fetching current and historical cryptocurrency prices
- **Database**: Configurable to use SQLite (for development) or PostgreSQL/MySQL (for production)
    
### Project Structure

`blockbuilders/`
`├── blockbuilders/` 
`│   ├── __init__.py` 
`│   ├── settings.py` 
`│   ├── urls.py` 
`│   ├── wsgi.py` 
`│   └── asgi.py` 
`├── app/` 
`│   ├── migrations/` 
`│   ├── static/` 
`│   ├── templates/` 
`│   ├── views.py` 
`│   ├── models.py` 
`│   └── ...` 
`├── manage.py` 
`├── requirements.txt` 
`└── README.md`

### Contributing

We welcome contributions from the community. To contribute, please fork the repository, create a feature branch, and submit a pull request. Make sure to follow the coding standards and include relevant tests for new features.

### License

This project is licensed under the MIT License. See the `LICENSE` file for more details.