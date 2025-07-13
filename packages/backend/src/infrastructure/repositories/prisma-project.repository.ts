import { Injectable } from "@nestjs/common";
import { IProjectRepository } from "../../domain/project/repositories/project.repository.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { ProjectMapper } from "../mappers/project.mapper";
import { Project } from "../../domain/project/entities/project.entity";

@Injectable()
export class PrismaProjectRepository implements IProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectMapper: ProjectMapper
  ) {}

  async findById(id: string, userId: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!project) {
      return null;
    }

    return this.projectMapper.toDomain(project);
  }

  async findManyByUserId(userId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        userId,
      },
    });

    return projects.map((project) => this.projectMapper.toDomain(project));
  }

  async save(project: Project): Promise<Project> {
    const prismaProject = this.projectMapper.toPersistence(project);

    const savedProject = await this.prisma.project.upsert({
      where: {
        id: prismaProject.id,
      },
      update: prismaProject,
      create: prismaProject,
    });

    return this.projectMapper.toDomain(savedProject);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.project.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}
