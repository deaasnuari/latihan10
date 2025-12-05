const { login } = require('../controllers/auth.controller');

// Mocks
jest.mock('../models/user.model', () => ({
  findByEmail: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to create mock req/res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (body = {}) => ({ body });

describe('auth.controller.login', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...OLD_ENV };
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_EXPIRE = '1d';
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('should return 400 when email is missing', () => {
    const req = mockReq({ password: 'pass' });
    const res = mockRes();

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email dan password wajib diisi' });
  });

  test('should return 400 when password is missing', () => {
    const req = mockReq({ email: 'a@b.com' });
    const res = mockRes();

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email dan password wajib diisi' });
  });

  test('should return 500 when User.findByEmail errors', () => {
    const req = mockReq({ email: 'a@b.com', password: 'pass' });
    const res = mockRes();
    User.findByEmail.mockImplementation((email, cb) => cb(new Error('DB down')));

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'DB down' });
  });

  test('should return 401 when user not found', () => {
    const req = mockReq({ email: 'a@b.com', password: 'pass' });
    const res = mockRes();
    User.findByEmail.mockImplementation((email, cb) => cb(null, []));

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email atau password salah' });
  });

  test('should return 401 when password mismatch', () => {
    const req = mockReq({ email: 'a@b.com', password: 'pass' });
    const res = mockRes();

    User.findByEmail.mockImplementation((email, cb) => cb(null, [{ id: 1, name: 'A', email, password: 'hashed' }]));
    bcrypt.compareSync.mockReturnValue(false);

    login(req, res);

    expect(bcrypt.compareSync).toHaveBeenCalledWith('pass', 'hashed');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email atau password salah' });
  });

  test('should sign and return token and user on success', () => {
    const req = mockReq({ email: 'a@b.com', password: 'pass' });
    const res = mockRes();

    const user = { id: 2, name: 'B', email: 'a@b.com', password: 'hashed' };
    User.findByEmail.mockImplementation((email, cb) => cb(null, [user]));
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue('signed-token');

    login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith({ id: 2, name: 'B', email: 'a@b.com' }, 'test_secret', { expiresIn: '1d' });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login sukses',
      token: 'signed-token',
      user: { id: 2, name: 'B', email: 'a@b.com' },
    });
  });

  test('should default expiresIn to 1d if JWT_EXPIRE not set', () => {
    const req = mockReq({ email: 'a@b.com', password: 'pass' });
    const res = mockRes();

    process.env.JWT_EXPIRE = '';

    const user = { id: 3, name: 'C', email: 'a@b.com', password: 'hashed' };
    User.findByEmail.mockImplementation((email, cb) => cb(null, [user]));
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue('signed-token');

    login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith({ id: 3, name: 'C', email: 'a@b.com' }, 'test_secret', { expiresIn: '1d' });
  });
});