import Module from "module";

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ProjectController],
  providers: [],
  exports: [],
})
export class ProjectModule {}
