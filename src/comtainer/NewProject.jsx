import React, { useEffect, useState } from "react";
import { FaChevronDown, FaCss3, FaHtml5, FaJs } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import { SplitPane } from "react-collapse-pane";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { Alert, UserProfileDetails } from "../components";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";

const NewProject = () => {
  const [alert, setAlert] = useState(false);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [isTitle, setisTitle] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const user = useSelector((state) => state.user.user);
  const [output, setOutput] = useState("");

  useEffect(() => {
    updateOutput();
  }, [html, css, js]);

  const updateOutput = () => {
    const combinedOutput = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    setOutput(combinedOutput);
  };

  const saveProgram = async () => {
    const id = `${Date.now()}`;
    const _doc = {
      id,
      title,
      html,
      css,
      js,
      output,
      user,
    };

    await setDoc(doc(db, "Projects", id), _doc)
      .then(() => {
        setAlert(true);
      })
      .catch((err) => console.log(err));

    setInterval(() => {
      setAlert(false);
    }, 2000);
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <AnimatePresence>
          {alert && <Alert status={"Success"} alertMsg={"Project Saved ..."} />}
        </AnimatePresence>

        <header className="w-full flex items-center justify-between px-12 py-4">
          <div className="flex items-center justify-center gap-6">
            <Link to={"/home"}>
              <img src={Logo} alt="" className="object-contain w-72 h-auto" />
            </Link>

            <div className="flex flex-col items-start justify-start">
              <div className="flex items-center justify-center gap-3">
                <AnimatePresence>
                  {isTitle ? (
                    <>
                      <motion.input
                        key={"TitleInput"}
                        type="text"
                        placeholder="Your Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="px-3 py-2 rounded-md bg-transparent text-primaryText text-base outline-none border-none"
                      />
                    </>
                  ) : (
                    <>
                      <motion.p
                        key={"titleLabel"}
                        className="px-3 py-2 text-white text-lg"
                      >
                        {title}
                      </motion.p>
                    </>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isTitle ? (
                    <>
                      <motion
                        key={"MdCheck"}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                        onClick={() => setisTitle(false)}
                      >
                        <MdCheck className="text-2xl text-emerald-500" />
                      </motion>
                    </>
                  ) : (
                    <>
                      <motion
                        key={"MdEdit"}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                        onClick={() => setisTitle(true)}
                      >
                        <MdEdit className="text-2xl text-primaryText" />
                      </motion>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center px-3 -mt-2 gap-2">
                <p className="text-primaryText text-sm">
                  {user[0]?.displayName
                    ? user[0].displayName
                    : `${user[0]?.email.split("@")[0]}`}
                </p>
                <motion.p
                  whileTap={{ scale: 0.9 }}
                  className="text-[10px] bg-emerald-500 rounded-sm px-2 py-[1px] text-primary font-semibold cursor-pointer"
                >
                  + Follow
                </motion.p>
              </div>
            </div>
          </div>

          {user && (
            <div className="flex items-center justify-center gap-4">
              <motion.button
                onClick={saveProgram}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-4 bg-primaryText cursor-pointer text-base text-primary font-semibold rounded-md"
              >
                Save
              </motion.button>
              <UserProfileDetails />
            </div>
          )}
        </header>

        <div className="flex-1 flex flex-col">
          <SplitPane
            split="horizontal"
            initialSizes={[50, 50]}
            collapse={true}
            resizerOptions={{
              grabberSize: "10px",
            }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <SplitPane split="vertical" initialSizes={[50, 50]} collapse={true}>
              <div className="w-full h-full flex flex-col items-start justify-start">
                <div className="w-full flex items-center justify-between">
                  <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                    <FaHtml5 className="text-xl text-red-500" />
                    <p className="text-primaryText font-semibold">HTML</p>
                  </div>
                  <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                    <FcSettings className="text-xl" />
                    <FaChevronDown className="text-xl text-primaryText" />
                  </div>
                </div>
                <div className="w-full px-2">
                  <CodeMirror
                    value={html}
                    height="600px"
                    extensions={[javascript({ jsx: true })]}
                    onChange={(value) => setHtml(value)}
                    theme={"dark"}
                  />
                </div>
              </div>

              <SplitPane split="vertical" initialSizes={[50, 50]} collapse={true}>
                <div className="w-full h-full flex flex-col items-start justify-start">
                  <div className="w-full flex items-center justify-between">
                    <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                      <FaCss3 className="text-xl text-sky-500" />
                      <p className="text-primaryText font-semibold">CSS</p>
                    </div>
                    <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                      <FcSettings className="text-xl" />
                      <FaChevronDown className="text-xl text-primaryText" />
                    </div>
                  </div>
                  <div className="w-full px-2">
                    <CodeMirror
                      value={css}
                      height="600px"
                      extensions={[javascript({ jsx: true })]}
                      onChange={(value) => setCss(value)}
                      theme={"dark"}
                    />
                  </div>
                </div>

                <div className="w-full h-full flex flex-col items-start justify-start">
                  <div className="w-full flex items-center justify-between">
                    <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                      <FaJs className="text-xl text-yellow-500" />
                      <p className="text-primaryText font-semibold">JS</p>
                    </div>
                    <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                      <FcSettings className="text-xl" />
                      <FaChevronDown className="text-xl text-primaryText" />
                    </div>
                  </div>
                  <div className="w-full px-2">
                    <CodeMirror
                      value={js}
                      height="600px"
                      extensions={[javascript({ jsx: true })]}
                      onChange={(value) => setJs(value)}
                      theme={"dark"}
                    />
                  </div>
                </div>
              </SplitPane>
            </SplitPane>
            <div className="bg-white">
              <iframe
                title="Result"
                srcDoc={output}
                style={{ border: "none", width: "100%", height: "100%" }}
              />
            </div>
          </SplitPane>
        </div>
      </div>
    </>
  );
};

export default NewProject;
