import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Request, Response } from 'express';
import { Prisma, LeadStatus } from '@prisma/client';
import { createLead, getLeads } from './lead.controller';

jest.mock('../lib/prisma', () => ({
  prisma: {
    lead: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from '../lib/prisma';

const mockCreate = prisma.lead.create as jest.MockedFunction<typeof prisma.lead.create>;
const mockFindMany = prisma.lead.findMany as jest.MockedFunction<typeof prisma.lead.findMany>;

function req(body: Record<string, unknown> = {}): Request {
  return { body } as Request;
}

function res(): Response {
  const r = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return r as unknown as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createLead', () => {
  it('returns 400 when name is missing', async () => {
    const r = res();
    await createLead(req({ email: 'a@b.com' }), r);
    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({ message: 'Name is required' });
  });

  it('returns 400 when email is missing', async () => {
    const r = res();
    await createLead(req({ name: 'Alice' }), r);
    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({ message: 'Email is required' });
  });

  it('returns 400 when email format is invalid', async () => {
    const r = res();
    await createLead(req({ name: 'Alice', email: 'not-an-email' }), r);
    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
  });

  it('returns 400 when status is invalid', async () => {
    const r = res();
    await createLead(req({ name: 'Alice', email: 'a@b.com', status: 'INVALID' }), r);
    expect(r.status).toHaveBeenCalledWith(400);
    expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid status value' }));
  });

  it('defaults status to NEW when not provided', async () => {
    const lead = { id: '1', name: 'Alice', email: 'alice@example.com', status: LeadStatus.NEW, createdAt: new Date() };
    mockCreate.mockResolvedValue(lead);
    await createLead(req({ name: 'Alice', email: 'alice@example.com' }), res());
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: LeadStatus.NEW }) }));
  });

  it('returns 201 with the created lead on success', async () => {
    const lead = { id: '1', name: 'Alice', email: 'alice@example.com', status: LeadStatus.NEW, createdAt: new Date() };
    mockCreate.mockResolvedValue(lead);
    const r = res();
    await createLead(req({ name: 'Alice', email: 'alice@example.com' }), r);
    expect(r.status).toHaveBeenCalledWith(201);
    expect(r.json).toHaveBeenCalledWith(lead);
  });

  it('normalises email to lowercase', async () => {
    const lead = { id: '1', name: 'Alice', email: 'alice@example.com', status: LeadStatus.NEW, createdAt: new Date() };
    mockCreate.mockResolvedValue(lead);
    await createLead(req({ name: 'Alice', email: 'Alice@Example.COM' }), res());
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ email: 'alice@example.com' }) }));
  });

  it('returns 409 on duplicate email', async () => {
    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '6.0.0',
    });
    mockCreate.mockRejectedValue(error);
    const r = res();
    await createLead(req({ name: 'Alice', email: 'alice@example.com' }), r);
    expect(r.status).toHaveBeenCalledWith(409);
    expect(r.json).toHaveBeenCalledWith({ message: 'Email already exists' });
  });

  it('returns 500 on unexpected error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreate.mockRejectedValue(new Error('db down'));
    const r = res();
    await createLead(req({ name: 'Alice', email: 'alice@example.com' }), r);
    expect(r.status).toHaveBeenCalledWith(500);
  });
});

describe('getLeads', () => {
  it('returns 200 with leads array', async () => {
    const leads = [{ id: '1', name: 'Alice', email: 'alice@example.com', status: LeadStatus.NEW, createdAt: new Date() }];
    mockFindMany.mockResolvedValue(leads);
    const r = res();
    await getLeads(req(), r);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(r.json).toHaveBeenCalledWith(leads);
  });

  it('returns 500 on error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFindMany.mockRejectedValue(new Error('db down'));
    const r = res();
    await getLeads(req(), r);
    expect(r.status).toHaveBeenCalledWith(500);
  });
});
