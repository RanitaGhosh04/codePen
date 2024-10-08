import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { MdDelete, MdEdit } from 'react-icons/md'
import { Link } from 'react-router-dom'
import {doc,deleteDoc} from 'firebase/firestore'
import { db } from "../config/firebase.config";

// gets the projects from the state first
// That means we need to push the project to the state first in redux store
// so somewhere we need to get the data

const Projects = () => {

  const projects = useSelector((state)=>state.projects?.projects)

  // when you type anything in searchbar, you need to set the state in searchTerm object in redux for filtering it or else store empty string

  const searchTerm = useSelector((state)=>
  //  if searchTerm object is there in state.searchTerm then set the state to searchTerm or else empty string and the fetch
    state.searchTerm?.searchTerm?state.searchTerm?.searchTerm:''
  )

  console.log(searchTerm);

  // filtering projects
  const [filtered, setfiltered] = useState(null)

  // // whenever searchTerm changes, filter
  // useEffect(()=>{
  //   // means if it will filter according to the letter
  //   if(searchTerm.length>0)
  //     {
  //       setfiltered(
  //       projects?.filter(project => {
  //         const lowerCaseItem = project?.title.toLowerCase()
  //         return searchTerm
  //         .split('')  //makes array of character
  //         .every((letter)=> lowerCaseItem.includes(letter)) //every method helps to iterate over the letters one by one
  //       })
  //     )
  //     }

  //     else{
  //       setfiltered(null)
  //     }
  // },[searchTerm])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setfiltered(
        projects?.filter(project => 
          project?.title.toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    } else {
      setfiltered(null);
    }
  }, [searchTerm, projects]);
  

  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "Projects", projectId));
        console.log("Project deleted successfully");
        // Optionally, you can dispatch an action to remove the project from Redux store
      } catch (error) {
        console.error("Error deleting project: ", error);
      }
    }
  };


  return (
    <div
    className=' w-full py-6 flex items-center justify-center gap-6 flex-wrap'>
      {filtered ? <>
        {filtered && 
        filtered.map((project,index)=>(
        <ProjectCard key={project.id} project={project} index={index} onDelete={deleteProject}/>
      ))}
      </> : 

      <>
        {projects && projects.map((project,index)=>(
        <ProjectCard key={project.id} project={project} index={index} onDelete={deleteProject}/>
      ))}
      </>}
      </div>
  )
}

// project card
const ProjectCard = ({project,index,onDelete}) => {
  const userEmailFirstChar =project?.user[0]?.email ? project?.user[0].email.charAt(0) : project?.user[0].displayName.charAt(0)

  const user = useSelector((state) => state.user?.user); // Get the user from the state
  console.log(project)
   
  return(
    <motion.div key={index} 
    className=' w-full cursor-pointer md:w-[450px] h-[375px] bg-secondary rounded-md p-4 flex flex-col items-center justify-center gap-4'
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration:0.5, delay: index*0.1}}
    >
    {/* display output */}
      <div
              className=" bg-primary w-full h-full rounded-md overflow-hidden"
              style={{ overflow: "hidden", height: "100%" }}
            >
              {/* combine all the outputs and load it into an inframe */}
              <iframe
                title="Result"
                srcDoc={project.output}
                style={{ border: "none", width: "100%", height: "100%" }}
              />
            </div>

            {/* image name and icons etc */}
            <div className=' flex items-center justify-start gap-3 w-full'>

              {/* image */}
              <div className='w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-emerald-500'>
              {project?.user[0]?.photoURL ? (
          <motion.img
            whileHover={{ scale: 1.2 }}
            src={project?.user[0].photoURL}
            // alt={user[0].displayName[0]|| 'User Photo'}
            className='w-full h-full object-cover'
          />
        ) : (
          <p className='text-xl text-white font-semibold capitalize'>
            {project?.user[0]?.displayName ? project?.user[0].displayName.charAt(0) : userEmailFirstChar || 'U'}
          </p>
        )}
        </div>
        
        <div>
          <p className=' text-white text-lg capitalize'>{project.title}</p>
          <p className=' text-primaryText text-sm capitalize'>
            {
              project?.user[0]?.displayName
              ? project?.user[0]?.displayName
              : `${project?.user[0]?.email?.split('@')[0]}`
            }
          </p>
        </div>

        {user && ( // Only render buttons if user exists
          <>
            <motion.div className='cursor-pointer ml-auto' whileTap={{ scale: 0.9 }}>
              <Link to={`/newproject/${project.id}`}>
                <MdEdit className='text-primaryText text-3xl' />
              </Link>
            </motion.div>

            <motion.div className='cursor-pointer ml-auto' whileTap={{ scale: 0.9 }} onClick={() => onDelete(project.id)}>
              <MdDelete className='text-primaryText text-3xl' />
            </motion.div>
          </>
        )}

            </div>
    </motion.div>
  )
}

export default Projects