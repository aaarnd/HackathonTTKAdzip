import axios from 'axios';

const api = axios.create({
  baseURL: 'http://5.35.92.45:8080/admin', 
});

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-access-token'] = token;
  } else {
    delete api.defaults.headers.common['x-access-token'];
  }
};

// Управление пользователями

export const loginUser = async (username, hashed_password) => {
    try {
        const response = await api.post('/auth/login', { username, hashed_password });
        
        const userData = {
            token: response.data.token, 
            username: username, 
            role: response.data.role,
            personal_info: response.data.personal_info
            
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        
        return userData; 
    } catch (error) {
        console.error('Ошибка входа', error.response); 
        throw error;
    }
};

export const createUser = async (values) => {
  try {
    const userData = localStorage.getItem('userData'); 
    console.log(JSON.parse(userData).token)

    const response = await api.post('/users/create', values, {
      headers: {
        Authorization: `Bearer ${JSON.parse(userData).token}`, 
      },    
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка входа', error.response); 
    throw error; 
  }
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/delete/${userId}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/users/update_role/${userId}`, { role });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// --- Тарифы ---

export const getTariffs = async () => { 
  try {
    const response = await api.get('api/tariffs')
    return response.data
  } catch(error) { 
    console.error("Ошибка: ", error)
    throw error
  }
}

export const createTariff = async (tariffData) => { 
  try {
    const userData = localStorage.getItem('userData'); // Получаем токен из localStorage
    const response = await api.post('api/tariffs', tariffData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(userData).token}`, // Добавляем токен в заголовок Authorization
      },    
    })
    return response.data
  } catch(error) { 
    console.error("Ошибка: ", error)
    throw error
  }
}

export const updateTariff = async (id, tariffData) => { 
  try {
    const userData = localStorage.getItem('userData'); // Получаем токен из localStorage
    const response = await api.put(`api/tariffs/${id}`, tariffData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(userData).token}`, // Добавляем токен в заголовок Authorization
      },    
    })
    return response.data
  } catch(error) { 
    console.error("Ошибка: ", error)
    throw error
  }
}

export const deleteTariff = async (id) => { 
  try {
    const userData = localStorage.getItem('userData'); // Получаем токен из localStorage
    console.log(id)
    const response = await api.delete(`api/tariffs/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(userData).token}`, // Добавляем токен в заголовок Authorization
      },    
    })
    return response.data
  } catch(error) { 
    console.error("Ошибка: ", error)
    throw error
  }
}

// Услуги

export const getOptions = async () => {
  try {
      const response = await api.get('/api/options');
      return response.data; 
  } catch (error) {
      console.error("Ошибка при получении услуг:", error);
      throw error;
  }
};

export const addOption = async (optionData) => {
  try {
      const response = await api.post('/api/options', optionData);
      return response.data; 
  } catch (error) {
      console.error("Ошибка при добавлении услуги:", error);
      throw error;
  }
};

export const updateOption = async (id, optionData) => { 
  try {
    console.log(optionData, id)
    const userData = localStorage.getItem('userData'); 
    const response = await api.put(`api/options/${id}`, optionData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(userData).token}`, 
      },    
    })
    return response.data
  } catch(error) { 
    console.error("Ошибка: ", error)
    throw error
  }
}

export const deleteOption = async (id) => {
  try {
      const response = await api.delete(`/api/options/${id}`);
      return response.data; 
  } catch (error) {
      console.error("Ошибка при удалении услуги:", error);
      throw error;
  }
};

// Намерения
  
export const deleteIntent = async (id) => {
    try {
        const response = await api.delete(`/api/intents/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting intent:", error);
        throw error;
    }
};

export const editIntent = async (id, intentData) => {
    try {
        const response = await api.put(`/api/intents/${id}`, intentData);
        return response.data;
    } catch (error) {
        console.error("Error updating intent:", error);
        throw error;
    }
};

export const addIntent = async (intentData) => {
    try {
        const response = await api.post('/api/intents', intentData);
        return response.data;
    } catch (error) {
        console.error("Error adding intent:", error);
        throw error;
    }
};

export const getAllIntents = async () => {
    try {
        const response = await api.get('/api/intents');
        return response.data;
    } catch (error) {
        console.error("Error fetching intents:", error);
        throw error;
    }
};


// Логи
export const createSession = async (sessionData) => {
    const response = await api.post('/api/sessions', sessionData);
    return response.data;
  };
  

export const getSessions = async (sessionData) => {
    const response = await api.get('/api/sessions', sessionData);
    return response.data;
};

// Создание постов

export const createPost = async (postData) => {
  const response = await api.post('/api/posts', postData);
  return response.data;
};



export { setAuthToken };
