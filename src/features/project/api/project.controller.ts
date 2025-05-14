import { Context } from 'hono'
import { ProjectService } from '../domain/project.service'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'
import { insertProjectSchema } from '../infrastructure/project.schema'
import { CreateProject } from '../domain/project.entity'

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  getAllProjects = async (c: Context<AppEnvironment>) => {
    const [error, allProjects] = await withLogging('Fetching all projects', {}, () =>
      this.projectService.getAllProjects()
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)

    return c.json({ success: true, data: allProjects })
  }

  getProjectById = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')

    const [error, project] = await withLogging('Fetching project by id', { projectId }, () =>
      this.projectService.getProjectById({ projectId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!project) return c.json({ success: false, message: 'Project not found' }, 404)

    return c.json({ success: true, data: project })
  }

  getProjectMedia = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')

    const [error, media] = await withLogging('Fetching media by project id', { projectId }, () =>
      this.projectService.getProjectMedia({ projectId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!media) return c.json({ success: false, message: 'Media not found' }, 404)

    return c.json({ success: true, data: media })
  }

  getProjectSingleMedia = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')
    const mediaId = c.req.param('mediaId')

    const [error, media] = await withLogging('Fetching media by id', { projectId, mediaId }, () =>
      this.projectService.getProjectSingleMedia({ projectId, mediaId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!media) return c.json({ success: false, message: 'Media not found' }, 404)

    return c.json({ success: true, data: media })
  }

  upsertProject = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')
    const userId = c.get('userId')
    const projectData = await c.req.json()
    const validData: CreateProject = insertProjectSchema.parse({ ...projectData, id: projectId })

    const [error, updatedProject] = await withLogging('Inserting project', { projectId, projectData }, () =>
      this.projectService.upsertProject({ projectId, userId, projectData: validData })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!updatedProject) return c.json({ success: false, message: 'Project not found' }, 404)

    return c.json({ success: true, data: updatedProject })
  }

  deleteProject = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')

    const [error, success] = await withLogging('Deleting project', { projectId }, () =>
      this.projectService.deleteProject({ projectId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Project not found' }, 404)

    return c.json({ success: true })
  }

  addMediaToProject = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')
    const mediaData = await c.req.json()

    const [error, success] = await withLogging('Adding media to project', { projectId, mediaData }, () =>
      this.projectService.addMediaToProject({ projectId, mediaData })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Project or media not found' }, 404)

    return c.json({ success: true })
  }
}
