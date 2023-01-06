import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { faker } from '@faker-js/faker';

const addUser = createAsyncThunk('users/add', async () => {
  const response = await axios.post('https://e0026557-curly-meme-55vj6v4gx4rf4jj4-3005.preview.app.github.dev/users', {
    name: faker.name.fullName(),
  });

  return response.data;
});

export { addUser };
