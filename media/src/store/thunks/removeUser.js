import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const removeUser = createAsyncThunk('users/remove', async (user) => {
    await axios.delete(
        `https://e0026557-curly-meme-55vj6v4gx4rf4jj4-3005.preview.app.github.dev/users/${user.id}`
    );

    return user;
});

export { removeUser };
