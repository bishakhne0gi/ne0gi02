import { Backend, Bash, C, Cpp, Css, Empty, Figma, Frontend, Git, Html, Java, Javascript, MongoDB, Next, NodeJs, Pug, ReactNative, Reactt, Socket, Sql, Tool, Web } from "../assets";

const skillset = {
    skill: [
        {
            id: 1,
            title: "Frontend",
            title_img: Frontend,
            one: "Javascript",
            one_val: Javascript,
            two: "ReactJS",
            two_val: Reactt,
            three: "React-Native",
            three_val: ReactNative,
            four: "HTML",
            four_val: Html,
            five: "CSS",
            five_val: Css,
            six: "PUG",
            six_val: Pug,
            sev: "NextJs",
            sev_val: Next
        },
        {
            id: 2,
            title: "Backend",
            title_img: Backend,
            one: "NodeJs",
            one_val: NodeJs,
            two: "Express",
            two_val: NodeJs,
            three: "MongoDB",
            three_val: MongoDB,
            four: "MySQL",
            four_val: Sql,
            five: "Socket.io",
            five_val: Socket,
            six: "",
            six_val: Empty,
            sev: "",
            sev_val: Empty
        },
        {
            id: 3,
            title: "Others",
            title_img: Tool,
            one: "C",
            one_val: C,
            two: "C++",
            two_val: Cpp,
            three: "Java",
            three_val: Java,
            four: "Git",
            four_val: Git,
            five: "Figma",
            five_val: Figma,
            six: "Bash",
            six_val: Bash,
            sev: "Web-Hosting",
            sev_val: Web
        }
    ]
}

export default skillset;