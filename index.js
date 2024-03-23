import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initialized postIDCounter.
let postIDCounter = 1;

// Storing Blog Posts in array of objects. Since we are not using any external database.
let allBlogPosts = [];

// GET request for Home page.
app.get('/', (req, res) => {
    res.render("index.ejs");
})

// GET request for form to make new Blog Posts.
app.get('/makePost', (req, res) => {
    res.render("makePost.ejs");
})

// POST request to handle submission of Blog posts.
app.post('/submit', (req, res) => {
    let newPost = req.body;
    newPost.id = postIDCounter++;
    allBlogPosts.push(req.body);
    res.render("index.ejs", { id: newPost.id, topic: req.body.topic, title: req.body.title, postContent: req.body['post-content'] });
    // console.log(allBlogPosts);
})

// GET request for user to view existing Blog Posts.
app.get('/viewPosts', (req, res) => {
    res.render("viewPost.ejs", { allBlogPosts: allBlogPosts });
})

// GET request for user to allow editing of a particular Blog Post.
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Find the index of the post in the array.
    const postToEdit = allBlogPosts.find(post => post.id === postId);
    if (postToEdit) {
        res.render("editPost.ejs", { post: postToEdit });
    } else {
        res.status(404).send('Post not found');
    }
});

// POST request to get updated Blog Post data and update the original Blog Post.
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Find the index of the post in the array
    const index = allBlogPosts.findIndex(post => post.id === postId);
    if (index !== -1) {
        allBlogPosts[index] = req.body;
        allBlogPosts[index].id = postId;
        // Redirect to the viewPosts page after updation.
        res.redirect('/viewPosts');
    } else {
        res.status(404).send('Post not found');
    }
});

// POST request to handle deletion of a particular Blog Post.
app.post('/deletePost/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Find the index of the post in the array.
    const index = allBlogPosts.findIndex(post => post.id === postId);
    if (index !== -1) {
        // Remove the post from the array.
        allBlogPosts.splice(index, 1);
    }
    // Redirect to the viewPosts page after deletion.
    res.redirect('/viewPosts');
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}.`);
})