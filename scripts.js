const backendBaseUrl = 'http://localhost:3000'; // Change to your backend address

// Fetch all users
fetch(`${backendBaseUrl}/api/users`) // Use the correct backend base URL
  .then(response => response.json())
  .then(data => console.log('Users:', data))
  .catch(error => console.error('Error fetching users:', error));

// Create a new user
const newUser = {
  username: 'exampleUser',
  email: 'example@example.com',
  password: 'examplePassword'
};

fetch(`${backendBaseUrl}/api/users`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newUser)
})
.then(response => response.json())
.then(data => console.log('User created:', data))
.catch(error => console.error('Error creating user:', error));

// Function to fetch all blog posts
async function fetchPosts() {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    displayPosts(posts); // Display the fetched posts
  } catch (error) {
    console.error('Error fetching posts:', error);
    alert('An error occurred while fetching posts. Please try again later.');
  }
}

// Function to display all blog posts
function displayPosts(posts) {
  const postList = document.getElementById('postList');
  postList.innerHTML = ''; // Clear existing content

  posts.forEach((post) => {
      const postItem = document.createElement('div');
      postItem.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p>Author ID: ${post.author_id}</p>
          <button onclick="editPost(${post.id})">Edit</button>
          <button onclick="deletePost(${post.id})">Delete</button>
      `;
      postList.appendChild(postItem);
  });
}

// Function to create a new blog post
document.getElementById('postForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form from submitting normally

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const author_id = parseInt(document.getElementById('author_id').value, 10);

  try {
      const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, author_id })
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
      const response = await fetch(`/api/posts/${postId}`, {
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
  // Display a modal or form for editing
  const newTitle = document.getElementById(`edit-title-${postId}`).value;
  const newContent = document.getElementById(`edit-content-${postId}`).value;

  if (newTitle && newContent) {
    updatePost(postId, newTitle, newContent);
  }
}

async function updatePost(postId, newTitle, newContent) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    fetchPosts(); // Reload the list of posts
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

// Function to create a new blog post with validation
document.getElementById('postForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form from submitting normally

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const author_id = parseInt(document.getElementById('author_id').value, 10);

  if (!title || !content || isNaN(author_id) || author_id < 0) {
    alert('Invalid input. Please ensure all fields are filled in correctly.');
    return;
  }

  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author_id }),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    fetchPosts(); // Reload the list of posts after creating
  } catch (error) {
    console.error('Error creating post:', error);
  }
});


// Fetch and display blog posts on page load
fetchPosts();