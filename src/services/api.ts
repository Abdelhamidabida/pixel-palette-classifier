import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface PredictionResponse {
  prediction: string;
  confidence: number;
}

export const predictBinary = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<PredictionResponse>(
    `${API_BASE_URL}/predict_binary`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

export const predictMulticlass = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<PredictionResponse>(
    `${API_BASE_URL}/predict_multiclass`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
