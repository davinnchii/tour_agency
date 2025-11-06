const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Tour = require('../../models/Tour');
const User = require('../../models/User');

describe('Tour Controller', () => {
  let testOperator;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tour_agency_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    // Clean up and close connection
    await Tour.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear data before each test
    await Tour.deleteMany({});
    await User.deleteMany({});

    // Create a test operator (for tour operator reference)
    const operatorData = {
      name: 'Test Operator',
      email: 'operator@example.com',
      password: 'password123',
      role: 'operator',
    };
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(operatorData);
    
    testOperator = registerResponse.body.user;
  });

  describe('GET /api/tours', () => {
    beforeEach(async () => {
      // Create test tours
      const tours = [
        {
          title: 'Tour 1',
          description: 'Description 1',
          country: 'Ukraine',
          price: 1000,
          operator: testOperator.id,
        },
        {
          title: 'Tour 2',
          description: 'Description 2',
          country: 'Poland',
          price: 2000,
          operator: testOperator.id,
        },
      ];

      for (const tour of tours) {
        await request(app)
          .post('/api/tours')
          .send(tour);
      }
    });

    it('should get all tours with pagination', async () => {
      const response = await request(app)
        .get('/api/tours')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('tours');
      expect(response.body.data).toHaveProperty('page');
      expect(response.body.data).toHaveProperty('totalPages');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data.tours.length).toBeGreaterThan(0);
    });

    it('should filter tours by country', async () => {
      const response = await request(app)
        .get('/api/tours')
        .query({ country: 'Ukraine' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tours.every(tour => tour.country === 'Ukraine')).toBe(true);
    });

    it('should filter tours by price range', async () => {
      const response = await request(app)
        .get('/api/tours')
        .query({ minPrice: 500, maxPrice: 1500 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tours.every(tour => tour.price >= 500 && tour.price <= 1500)).toBe(true);
    });

    it('should search tours by text', async () => {
      const response = await request(app)
        .get('/api/tours')
        .query({ search: 'Tour 1' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tours.some(tour => tour.title.includes('Tour 1'))).toBe(true);
    });
  });

  describe('POST /api/tours', () => {
    it('should create a new tour', async () => {
      const tourData = {
        title: 'New Tour',
        description: 'Tour description',
        country: 'Italy',
        price: 1500,
        operator: testOperator.id,
      };

      const response = await request(app)
        .post('/api/tours')
        .send(tourData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', tourData.title);
      expect(response.body.data).toHaveProperty('country', tourData.country);
      expect(response.body.data).toHaveProperty('price', tourData.price);
    });

    it('should not create tour without required fields', async () => {
      const tourData = {
        description: 'Tour description',
        // Missing title, country, price, operator
      };

      const response = await request(app)
        .post('/api/tours')
        .send(tourData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });

  describe('GET /api/tours/:id', () => {
    let tourId;

    beforeEach(async () => {
      const tourData = {
        title: 'Test Tour',
        description: 'Test Description',
        country: 'Spain',
        price: 2000,
        operator: testOperator.id,
      };

      const response = await request(app)
        .post('/api/tours')
        .send(tourData);
      
      tourId = response.body.data._id;
    });

    it('should get tour by id', async () => {
      const response = await request(app)
        .get(`/api/tours/${tourId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', tourId);
      expect(response.body.data).toHaveProperty('title', 'Test Tour');
    });

    it('should return 404 for non-existent tour', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/tours/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tour not found');
    });
  });

  describe('PUT /api/tours/:id', () => {
    let tourId;

    beforeEach(async () => {
      const tourData = {
        title: 'Original Tour',
        description: 'Original Description',
        country: 'France',
        price: 1000,
        operator: testOperator.id,
      };

      const response = await request(app)
        .post('/api/tours')
        .send(tourData);
      
      tourId = response.body.data._id;
    });

    it('should update tour successfully', async () => {
      const updateData = {
        title: 'Updated Tour',
        price: 1500,
      };

      const response = await request(app)
        .put(`/api/tours/${tourId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', 'Updated Tour');
      expect(response.body.data).toHaveProperty('price', 1500);
    });

    it('should return 404 for non-existent tour', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/tours/${fakeId}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tours/:id', () => {
    let tourId;

    beforeEach(async () => {
      const tourData = {
        title: 'Tour to Delete',
        description: 'Description',
        country: 'Germany',
        price: 1000,
        operator: testOperator.id,
      };

      const response = await request(app)
        .post('/api/tours')
        .send(tourData);
      
      tourId = response.body.data._id;
    });

    it('should delete tour successfully', async () => {
      const response = await request(app)
        .delete(`/api/tours/${tourId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tour deleted successfully');

      // Verify tour is deleted
      const getResponse = await request(app)
        .get(`/api/tours/${tourId}`)
        .expect(404);
    });

    it('should return 404 for non-existent tour', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/tours/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});

