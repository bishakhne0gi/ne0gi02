import React, { useState } from 'react'
import './projects.css'
import data from '../../utils/projects'
import ProjectCards from '../projectcards/ProjectCards'
import MiniProj from '../miniProj/MiniProj'
const Projects = () => {


    const [projects, setProjects] = useState(data);

    return (
        <>
            <div className="container_projects section__padding">
                <div className="header proj">
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
                                a4={project.a4}
                                github={project.github}
                                live={project.live}

                            />

                        ))
                    }

                </div>
                <MiniProj />
            </div>
        </>
    )
}

export default Projects