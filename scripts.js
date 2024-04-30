const backendBaseUrl = 'http://localhost:3000'; // Ensure this is the correct backend base URL

// Fetch all blog posts
async function fetchPosts() {
  try {
    const response = await fetch(`${backendBaseUrl}/api/posts`); // Correct endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    displayPosts(posts); // Display fetched posts
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Function to display all blog posts
function displayPosts(posts) {
  const postList = document.getElementById('postList'); // Ensure this ID exists in the HTML
  postList.innerHTML = ''; // Clear existing content
  posts.forEach((post) => {
    const postItem = document.createElement('div');
    postItem.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <button onclick="editPost(${post.id})">Edit</button>
      <button onclick="deletePost(${post.id})">Delete</button>
    `;
    postList.appendChild(postItem);
  });
}

// Function to create a new blog post
document.getElementById('postForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form from submitting normally

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const author_id = parseInt(document.getElementById('author_id').value, 10);

  if (!title || !content || isNaN(author_id) || author_id < 0) {
    alert('Invalid input. Please ensure all fields are correct.');
    return;
  }

  try {
    const response = await fetch(`${backendBaseUrl}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author_id }),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    fetchPosts(); // Reload the list of posts
  } catch (error) {
    console.error('Error creating post:', error);
  }
});

// Function to delete a blog post
async function deletePost(postId) {
  try {
    const response = await fetch(`${backendBaseUrl}/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    fetchPosts(); // Reload the list of posts after deletion
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

// Function to edit a blog post
function editPost(postId) {
  // This could display a modal or inline form for editing
  const newTitle = prompt('Enter new title');
  const newContent = prompt('Enter new content');

  if (newTitle && newContent) {
    updatePost(postId, newTitle, newContent);
  }
}

// Function to update a blog post
async function updatePost(postId, newTitle, newContent) {
  try {
    const response = await fetch(`${backendBaseUrl}/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    fetchPosts(); // Reload the list of posts after updating
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

// Fetch and display blog posts on page load
fetchPosts();
