require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
connectDB();

const staffRoutes = require('./routes/staff.route');


// const bookRoutes = require('./routes/book.route');
// const publisherRoutes = require('./routes/publisher.route');
// const borrowRoutes = require('./routes/borrow.route');
// const userRoutes = require('./routes/user.route');
// const commentRoutes = require('./routes/comment.route');


app.use('/api/staff', staffRoutes);

// app.use('/api/books', bookRoutes);
// app.use('/api/publishers', publisherRoutes);
// app.use('/api/borrow', borrowRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/comments', commentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});