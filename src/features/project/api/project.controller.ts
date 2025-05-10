import { Context } from 'hono'
import { ProjectService } from '../domain/project.service'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'
import { updateProjectSchema } from '../infrastructure/project.schema'

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

  getProjectVideos = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')

    const [error, videos] = await withLogging('Fetching videos by project id', { projectId }, () =>
      this.projectService.getProjectVideos({ projectId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!videos) return c.json({ success: false, message: 'Videos not found' }, 404)

    return c.json({ success: true, data: videos })
  }

  getProjectVideo = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')
    const videoId = c.req.param('videoId')

    const [error, video] = await withLogging('Fetching video by id', { projectId, videoId }, () =>
      this.projectService.getProjectVideo({ projectId, videoId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!video) return c.json({ success: false, message: 'Video not found' }, 404)

    return c.json({ success: true, data: video })
  }

  upsertProject = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')
    const userId = c.req.param('userId')
    const projectData = await c.req.json()
    const validData = updateProjectSchema.parse(projectData)

    const [error, updatedProject] = await withLogging('Updating project', { projectId, projectData }, () =>
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

  addVideoToProject = async (c: Context<AppEnvironment>) => {
    const projectId = c.req.param('projectId')
    const videoData = await c.req.json()

    const [error, success] = await withLogging('Adding video to project', { projectId, videoData }, () =>
      this.projectService.addVideoToProject({ projectId, videoData })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Project or video not found' }, 404)

    return c.json({ success: true })
  }
}
