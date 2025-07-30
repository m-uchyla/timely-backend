import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './Service.entity';
import { ServicesService } from './Services.service';

const mockServiceRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('ServicesService', () => {
  let service: ServicesService;
  let repo: Repository<Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: mockServiceRepository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repo = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      const services = [{ id: 1, name: 'Test Service' }];
      mockServiceRepository.find.mockResolvedValue(services);

      expect(await service.findAll()).toEqual(services);
    });
  });

  describe('findOne', () => {
    it('should return a service if found', async () => {
      const serviceEntity = { id: 1, name: 'Test Service' };
      mockServiceRepository.findOne.mockResolvedValue(serviceEntity);

      expect(await service.findOne(1)).toEqual(serviceEntity);
    });

    it('should throw NotFoundException if not found', async () => {
      mockServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new service', async () => {
      const createDto = { name: 'New Service', durationMinutes: 60, organizationId: 123 };
      const serviceEntity = { id: 1, ...createDto };
      mockServiceRepository.create.mockReturnValue(serviceEntity);
      mockServiceRepository.save.mockResolvedValue(serviceEntity);

      expect(await service.create(createDto)).toEqual(serviceEntity);
    });
  });

  describe('update', () => {
    it('should update and return the updated service', async () => {
      const updateDto = { name: 'Updated Service' };
      const serviceEntity = { id: 1, name: 'Old Service' };
      mockServiceRepository.findOne.mockResolvedValue(serviceEntity);
      mockServiceRepository.save.mockResolvedValue({ ...serviceEntity, ...updateDto });

      expect(await service.update(1, updateDto)).toEqual({ ...serviceEntity, ...updateDto });
    });

    it('should throw NotFoundException if service not found', async () => {
      mockServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated Service' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the service if found', async () => {
      mockServiceRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if service not found', async () => {
      mockServiceRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
