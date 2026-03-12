"use client";
import { motion } from "motion/react";
import { Star, MessageSquare, ThumbsUp as Heart, Reply, ArrowRight } from "lucide-react";

const ratingBars = [
  { star: 5, width: "65%", count: "16" },
  { star: 4, width: "15%", count: "04" },
  { star: 3, width: "10%", count: "03" },
  { star: 2, width: "6%", count: "02" },
  { star: 1, width: "3%", count: "01" },
];

const reviews = [
  {
    id: 1,
    name: "Michael R.",
    date: "Yesterday",
    content: "This car was in immaculate condition, and the entire rental process was seamless.",
    rating: 5,
    likes: 42,
    avatar: "MR"
  },
  {
    id: 2,
    name: "Sophia K.",
    date: "2 days ago",
    content: "Loved the car's performance and luxury features. However, the pickup process took longer than expected. Overall, a great experience.",
    rating: 4,
    likes: 35,
    avatar: "SK",
    reply: {
      name: "Arthur Brown",
      date: "2 days ago",
      content: "Thank you for your feedback, Sophia! and apologize for delay during pickup."
    }
  },
  {
    id: 3,
    name: "Liam T.",
    date: "1 week ago",
    content: "An exhilarating experience! The Porsche was perfect for our weekend getaway.",
    rating: 5,
    likes: 26,
    avatar: "LT"
  }
];

export const ReviewsSection = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-gray-50">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left - Reviews List */}
          <div className="w-full lg:w-3/5 space-y-12">
            <div>
              <span className="text-gray-400 text-[12px] font-bold tracking-[2px] uppercase mb-4 block">01/Reviews</span>
              <h2 className="text-[#1a1a1a] text-[32px] font-bold tracking-tight">What Drivers Say</h2>
            </div>

            <div className="space-y-10">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-10 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 flex-shrink-0">
                      {review.avatar}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[#1a1a1a] font-semibold text-[15px]">{review.name}</span>
                        <span className="text-gray-400 text-[13px]">{review.date}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "text-orange-400 fill-orange-400" : "text-gray-200"} />
                        ))}
                      </div>

                      <p className="text-gray-600 text-[14px] leading-relaxed italic">
                        "{review.content}"
                      </p>

                      <div className="flex items-center gap-6 pt-2">
                        <button className="text-gray-400 hover:text-black transition-colors text-[13px] font-medium">Reply</button>
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors text-[13px] font-medium">
                          <Heart size={14} /> {review.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors text-[13px] font-medium">
                          <MessageSquare size={14} /> 0
                        </button>
                      </div>

                      {/* Reply from host */}
                      {review.reply && (
                        <div className="mt-8 pl-8 border-l-2 border-gray-100 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[#1a1a1a] font-semibold text-[14px]">{review.reply.name}</span>
                            <span className="text-gray-400 text-[12px]">{review.reply.date}</span>
                          </div>
                          <p className="text-gray-500 text-[14px] leading-relaxed">
                            {review.reply.content}
                          </p>
                          <div className="flex items-center gap-6 pt-1">
                            <button className="text-gray-400 hover:text-black transition-colors text-[12px] font-medium">Reply</button>
                            <button className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors text-[12px] font-medium">
                              <Heart size={12} /> 2
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Rating Stats & Promotional Card */}
          <div className="w-full lg:w-2/5 space-y-16">
            {/* Rating Summary */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-[2px]">Total Rating</span>
                  <div className="text-[#1a1a1a] text-[48px] font-bold leading-none mt-2">4.2</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className={i < 4 ? "text-orange-400 fill-orange-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-[13px] mt-2">Based on 26 reviews</span>
                </div>
              </div>

              <div className="space-y-4">
                {ratingBars.map((bar) => (
                  <div key={bar.star} className="flex items-center gap-4">
                    <span className="text-gray-400 text-[13px] w-4">{bar.star}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: bar.width }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-orange-400 rounded-full" 
                      />
                    </div>
                    <span className="text-[#1a1a1a] text-[13px] font-medium w-8 text-right">{bar.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Ride Promotion */}
            <div className="relative p-8 rounded-[32px] overflow-hidden min-h-[320px] bg-gradient-to-br from-[#1b1c20] to-[#040404] group cursor-pointer shadow-2xl">
              {/* This would be an image ideally */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
              
              <div className="relative h-full flex flex-col justify-between items-start z-10">
                <div className="w-full flex justify-between items-center">
                  <span className="text-gray-300 text-[12px] font-medium tracking-wide">Featured Ride</span>
                  <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span className="text-white text-[12px] font-bold uppercase tracking-wider">Book Now</span>
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white text-[28px] font-bold tracking-tight">McLaren P1</h3>
                  <div className="inline-flex items-center px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-gray-300 text-[9px] font-bold tracking-[1.5px] uppercase">50% Off Weekend Rentals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
