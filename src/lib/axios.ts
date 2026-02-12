// src/lib/axios.ts
import axios from 'axios';

const supabaseAxios = axios.create({
  baseURL: 'https://hvrsqtnoihpycmxsqcgy.supabase.co/rest/v1',
  headers: {
    apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFremF5dm9sdHlpa2RpeGRjdW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODA3NDIsImV4cCI6MjA2MDU1Njc0Mn0._PNjRql6RUd8viDJWlo72ScSPMUT5Uc5vS86ZJdVPqY', // Replace this with your actual anon/public API key
    Authorization: 'Bearer your-anon-key-here',
    'Content-Type': 'application/json',
  },
});

export default supabaseAxios;
