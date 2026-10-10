import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      quote:
        'FoodRescue AI changed our banquet operations completely. Instead of throwing away hundreds of fresh buffet portions at 11 PM, a courier is matched and picks them up within 30 minutes.',
      author: 'Chef Ranveer Kapoor',
      role: 'Executive Chef, The Grand Royale Hotel',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop&q=60',
      rating: 5,
    },
    {
      quote:
        'The priority classification is a game-changer. We know exactly which hot meals need immediate distribution and which bakery goods can wait for breakfast shelter runs.',
      author: 'Dr. Sunita Sharma',
      role: 'Director, Hope Food Shelter',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60',
      rating: 5,
    },
    {
      quote:
        'As a volunteer bike rider, the turn-by-turn route suggestions and clear pickup instructions make each rescue mission smooth and fulfilling.',
      author: 'Alex Rivera',
      role: 'Volunteer Rescue Courier',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Trusted Network
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Voices from the Rescue Network
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            How our ecosystem empowers donors, community shelters, and couriers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl bg-white p-7 border border-slate-200/80 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={item.image}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.author}</h4>
                  <p className="text-[11px] text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
