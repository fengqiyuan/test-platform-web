import http from '../../axios';

const API_URL = 'https://example.com/api';

export function save_mock_data(userId) {
  const url = `${API_URL}/users/${userId}`;

  return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}



export function updateUser(userId, data) {
  const url = `${API_URL}/users/${userId}`;

  return axios.put(url, data)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}
