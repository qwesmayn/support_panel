import { FC } from "react";
import ChatRow from "../ChatRow/ChatRow";
import { Headphones, Settings } from 'lucide-react';
import { IAdminUser } from "../../../models/IAdminUser";
import { ITicket } from "../../../models/ITicket";

interface SidebarProps {
  user: IAdminUser | null
  tickets : ITicket[] | null
  onClickTicket: (ticketId: string) => void
  role : string
}

const Sidebar: FC<SidebarProps> = ({user, tickets, onClickTicket, role}) => {

  return (
    <div className="h-full text-white border border-[#1d1d1d] w-full max-w-[500px] rounded-2xl flex flex-col">
      <div>
        <div className="flex items-center gap-2 p-5 border-b border-[#1d1d1d]">
          <div>
            <img src="" alt="" />
          </div>
          <div>
            <h3 className="text-2xl">Support Panel</h3>
          </div>
        </div>
        <div className="p-5 border-b border-[#1d1d1d]">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search tickets"
              className="w-full px-5 py-2 text-gray-400 bg-[#1b1b1b] rounded-full text-lg"
            />
          </div>
          <div>
            <ul className="flex items-center justify-between">
              <li>
                <a
                  href=""
                  className="pb-[21.5px] px-2 transition-all duration-300 border-b border-[#1d1d1d] hover:border-b hover:border-white"
                >
                  Все
                </a>
              </li>
              {role === "admin" && <li>
                <a
                  href=""
                  className="pb-[21.5px] px-2 transition-all duration-300 border-b border-[#1d1d1d] hover:border-b hover:border-white"
                >
                  Активные
                </a>
              </li>}
              {role === "admin" && <li>
                <a
                  href=""
                  className="pb-[21.5px] px-2 transition-all duration-300 border-b border-[#1d1d1d] hover:border-b hover:border-white"
                >
                  Новые
                </a>
              </li>}
              <li>
                <a
                  href=""
                  className="pb-[21.5px] px-2 transition-all duration-300 border-b border-[#1d1d1d] hover:border-b hover:border-white"
                >
                  Закрытые
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col gap-1">
          {tickets?.map((ticket, index) => (
            <ChatRow key={index} ticket={ticket} onClickTicket={onClickTicket}/>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-5 border-t border-[#1d1d1d]">
        <div className="flex items-center">
          <img src={user?.avatar || "https://placehold.co/45"} alt="Avatar" className="rounded-full mr-3"/>
          <p>{user?.login || "Username"}</p>
        </div>
        <div className="flex items-center gap-5">
          <Headphones size={25}/>
          <Settings size={25}/>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
