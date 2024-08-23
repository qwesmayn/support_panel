import { FC, useState, useEffect } from "react";
import ChatRow from "../ChatRow/ChatRow";
import { Headphones, Settings } from 'lucide-react';
import { IAdminUser } from "../../../models/IAdminUser";
import { ITicket } from "../../../models/ITicket";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserInfo } from "../../../hooks/useUserInfo";

interface SidebarProps {
  user: IAdminUser | null;
  tickets: ITicket[] | null;
  onClickTicket: (ticketId: string) => void;
  role: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ user, tickets, onClickTicket, role, searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useUserInfo()

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredTickets, setFilteredTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter') || 'all';
    setActiveFilter(filter);
  }, [location.search]);

  useEffect(() => {
    if (!tickets) return;

    let filtered = tickets;
    switch (activeFilter) {
      case 'active':
        filtered = tickets.filter(ticket => ticket.status != 'close');
        break;
      case 'new':
        filtered = tickets.filter(ticket => ticket.unreadMessagesCount > 0);
        break;
      case 'closed':
        filtered = tickets.filter(ticket => ticket.status === 'closed');
        break;
      default:
        filtered = tickets;
        break;
    }

    const matchesSearchQuery = (text: string) => {
      return text.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const finalFilteredTickets = filtered.filter(ticket => {
      const userLogin = ticket.userId?.login ?? '';
      return matchesSearchQuery(userLogin);
    });

    if(userInfo.userInfo?.role === "admin"){
      finalFilteredTickets.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    }

    setFilteredTickets(finalFilteredTickets);
  }, [tickets, activeFilter, searchQuery, userInfo.userInfo?.role]);

  const handleClick = (filter: string) => {
    navigate(`?filter=${filter}`);
  };

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
        <div className="px-5 pt-5 border-b border-[#1d1d1d]">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search tickets"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-5 py-2 text-gray-400 bg-[#1b1b1b] rounded-full text-lg"
            />
          </div>
          <div>
            <ul className="flex items-center justify-between">
              <li>
                <button
                  onClick={() => handleClick('all')}
                  className={`pb-[21.5px] px-2 transition-all duration-300 border-b-2 ${activeFilter === 'all' ? 'border-white' : 'border-transparent'}`}
                >
                  Все
                </button>
              </li>
              {role === "admin" && (
                <>
                  <li>
                    <button
                      onClick={() => handleClick('active')}
                      className={`pb-[21.5px] px-2 transition-all duration-300 border-b-2 ${activeFilter === 'active' ? 'border-white' : 'border-transparent'}`}
                    >
                      Активные
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleClick('new')}
                      className={`pb-[21.5px] px-2 transition-all duration-300 border-b-2 ${activeFilter === 'new' ? 'border-white' : 'border-transparent'}`}
                    >
                      Новые
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => handleClick('closed')}
                  className={`pb-[21.5px] px-2 transition-all duration-300 border-b-2 ${activeFilter === 'closed' ? 'border-white' : 'border-transparent'}`}
                >
                  Закрытые
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col gap-1">
          {filteredTickets.map((ticket, index) => (
            <ChatRow key={index} ticket={ticket} onClickTicket={onClickTicket} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-5 border-t border-[#1d1d1d]">
        <div className="flex items-center">
          <img src={user?.avatar || "https://placehold.co/45"} alt="Avatar" className="rounded-full mr-3" />
          <p>{user?.login || "Username"}</p>
        </div>
        <div className="flex items-center gap-5">
          <Headphones size={25} />
          <Settings size={25} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
