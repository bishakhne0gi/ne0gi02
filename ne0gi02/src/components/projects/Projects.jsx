import React, { useState } from 'react'
import './projects.css'
import data from '../../utils/projects'
import ProjectCards from '../projectcards/ProjectCards'
const Projects = () => {


    const [projects, setProjects] = useState(data);

    return (
        <>
            <div className="container_projects section__padding">
                <div className="header">
                    Projects
                </div>

                <div className='projects_wrap section__padding'>



                    {
                        projects.project.map((project) =>

                        (
                            <ProjectCards
                                key={project.id}
                                pic1={project.pic1}
                                pic2={project.pic2}
                                pic3={project.pic3}
                                title={project.title}
                                description={project.description}
                                one={project.one}
                                two={project.two}
                                three={project.three}
                                four={project.four}
                                five={project.five}
                                six={project.six}
                                a1={project.a1}
                                a2={project.a2}
                                a3={project.a3}
                                github={project.github}

                            />

                        ))
                    }

                </div>
            </div>
        </>
    )
}

export default Projects