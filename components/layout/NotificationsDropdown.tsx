"use client";

import React, { useState, useEffect, useRef } from "react";
import { getNotifications, type Notification } from "@/lib/db/notifications";

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const prevNotificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const data = await getNotifications();
    
    // إذا لم يفتح المستخدم القائمة بعد - تحقق من الإشعارات الجديدة
    if (hasOpened) {
      const prevIds = prevNotificationsRef.current.map((n) => n.id);
      const newNotifications = data.filter((n) => !prevIds.includes(n.id) && !n.read);
      if (newNotifications.length > 0) {
        // إشعارات جديدة - أظهر العلامة
        setHasOpened(false);
      }
    }

    prevNotificationsRef.current = data;
    setNotifications(data);
    
    if (!hasOpened) {
      setUnreadCount(data.filter((n) => !n.read).length);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      // فتح القائمة - إخفاء العلامة
      setHasOpened(true);
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  const typeStyles: Record<string, { icon: string; bg: string }> = {
    today: { icon: "fa-calendar-check", bg: "bg-teal-light text-teal" },
    upcoming: { icon: "fa-calendar-alt", bg: "bg-blue-50 text-blue-500" },
    overdue: { icon: "fa-exclamation-circle", bg: "bg-red-50 text-accent-red" },
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-secondary hover:text-navy transition-colors"
      >
        <i className="far fa-bell text-lg sm:text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 end-1.5 min-w-[18px] h-[18px] bg-accent-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full end-0 mt-2 w-80 bg-white rounded-xl shadow-hover border border-gray-100 z-50 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-navy">الإشعارات</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-secondary hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <i className="far fa-bell text-3xl text-gray-300 mb-2 block"></i>
                <p className="text-sm text-gray-secondary">لا توجد إشعارات</p>
              </div>
            ) : (
              <div>
                {notifications.map((notif) => {
                  const style = typeStyles[notif.type] || typeStyles.today;
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        !notif.read && !hasOpened ? "bg-teal-light/10" : ""
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <i className={`fas ${style.icon} text-sm`}></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-secondary mt-0.5">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && !hasOpened && (
                        <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-2"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsDropdown;