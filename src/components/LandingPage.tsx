import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Crop Analysis',
      description: 'Upload crop images for instant disease detection and treatment recommendations using advanced AI technology.'
    },
    {
      icon: '🌦️',
      title: 'Real-time Weather Monitoring',
      description: 'Get accurate weather forecasts and alerts to optimize your farming schedule and protect your crops.'
    },
    {
      icon: '📡',
      title: 'IoT Sensor Network',
      description: 'Monitor soil moisture, temperature, and nutrients in real-time with our smart sensor network.'
    },
    {
      icon: '👥',
      title: 'Expert Community',
      description: 'Connect with agricultural experts and fellow farmers for knowledge sharing and problem solving.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Make data-driven decisions with comprehensive analytics and performance insights for your farm.'
    },
    {
      icon: '💬',
      title: '24/7 AI Assistant',
      description: 'Get instant answers to farming questions with our intelligent chatbot powered by agricultural expertise.'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Punjab, India',
      rating: 5,
      text: 'Field-Wise helped me detect wheat rust early and saved my entire crop. The AI analysis is incredibly accurate!',
      avatar: '👨‍🌾'
    },
    {
      name: 'Priya Sharma',
      location: 'Maharashtra, India',
      rating: 5,
      text: 'The weather predictions and IoT sensors helped me optimize irrigation and increase my tomato yield by 40%.',
      avatar: '👩‍🌾'
    },
    {
      name: 'Mohamed Ali',
      location: 'Karnataka, India',
      rating: 5,
      text: 'Amazing community support! Got expert advice on pest control that saved thousands of rupees in pesticides.',
      avatar: '👨‍🌾'
    },
    {
      name: 'Lakshmi Devi',
      location: 'Andhra Pradesh, India',
      rating: 5,
      text: 'The crop disease detection feature is a game-changer. Quick, accurate, and easy to use!',
      avatar: '👩‍🌾'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Farmers' },
    { number: '99.2%', label: 'Accuracy Rate' },
    { number: '500+', label: 'Crop Diseases Detected' },
    { number: '24/7', label: 'Expert Support' }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for small farmers getting started',
      features: [
        '5 crop analyses per month',
        'Basic weather forecasts',
        'Community access',
        'Email support'
      ],
      popular: false,
      color: 'bg-gray-50 border-gray-200'
    },
    {
      name: 'Pro',
      price: '₹999',
      period: 'per month',
      description: 'Ideal for growing farms and professionals',
      features: [
        'Unlimited crop analyses',
        'Advanced weather predictions',
        'IoT sensor integration',
        'Priority expert support',
        'Advanced analytics',
        'Custom recommendations'
      ],
      popular: true,
      color: 'bg-green-50 border-green-500'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      description: 'For large farms and agricultural organizations',
      features: [
        'Everything in Pro',
        'Custom AI model training',
        'White-label solution',
        'Dedicated account manager',
        'API access',
        'Custom integrations'
      ],
      popular: false,
      color: 'bg-blue-50 border-blue-200'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌾</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Field-Wise</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">About</a>
              <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors">Reviews</a>
              <Link 
                to="/dashboard" 
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <button className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                AI-Powered Smart Farming
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                From our fields to your
                <span className="text-green-600 block">table, cultivating</span>
                <span className="text-blue-600">quality</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join 10,000+ farmers using AI-powered crop analysis, IoT sensors, and expert guidance 
                to maximize yield, detect diseases early, and make data-driven farming decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/crop-health"
                  className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🔬 Try Crop Analysis
                </Link>
                <Link 
                  to="/dashboard"
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all"
                >
                  📊 View Dashboard
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐⭐⭐⭐⭐</span>
                  <span>4.9/5 Rating</span>
                </div>
                <div>10,000+ Users</div>
                <div>99.2% Accuracy</div>
              </div>
            </div>

            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                {/* Main Dashboard Preview */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Crop Health Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Crop Analysis Complete</p>
                          <p className="text-lg font-semibold text-green-800">Healthy Wheat Detected</p>
                        </div>
                        <div className="text-2xl">🌾</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">28°C</p>
                        <p className="text-xs text-blue-500">Temperature</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-600">65%</p>
                        <p className="text-xs text-purple-500">Humidity</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-700 mb-2">Active Sensors: 12/12 ✅</p>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 transform rotate-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">99.2%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-3 border border-gray-200 transform -rotate-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🚨</span>
                    <div>
                      <p className="text-xs font-medium text-red-600">Alert</p>
                      <p className="text-xs text-gray-500">Check Field A</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 font-medium">Trusted by farmers across India</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-green-600">{stat.number}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">🚀</span>
              Advanced Features
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for modern farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines AI technology, IoT sensors, and expert knowledge 
              to revolutionize your farming experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="mr-2">💡</span>
                About Field-Wise
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Advancing innovative farming techniques
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Field-Wise is your comprehensive digital farming companion, designed to bridge the gap 
                between traditional agriculture and modern technology. Our platform empowers farmers 
                with AI-driven insights, real-time monitoring, and expert guidance to maximize crop 
                yield while minimizing environmental impact.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🧠</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Farming</h4>
                    <p className="text-sm text-gray-600">AI-powered decision making for optimal crop management</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🌱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Eco-Friendly</h4>
                    <p className="text-sm text-gray-600">Sustainable practices that protect our environment</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">👨‍💼</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Support</h4>
                    <p className="text-sm text-gray-600">24/7 access to agricultural experts and community</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">📈</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Growth Focused</h4>
                    <p className="text-sm text-gray-600">Data-driven insights for continuous improvement</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">👨‍🌾</div>
                  <div>
                    <p className="font-semibold text-gray-900">Trusted by 10,000+ farmers</p>
                    <p className="text-sm text-gray-600">Serving agricultural communities across India</p>
                  </div>
                  <div className="flex -space-x-2">
                    {['👨‍🌾', '👩‍🌾', '👨‍💼', '👩‍💼'].map((avatar, i) => (
                      <div key={i} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-lg">{avatar}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-lg opacity-90 mb-6">
                    Empowering farmers with technology to feed the world sustainably while protecting our planet for future generations.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                      <span>Increase crop yield by 35%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                      <span>Reduce pesticide use by 50%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                      <span>Save 40% on water consumption</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-6xl opacity-20">🌾</div>
                <div className="absolute bottom-4 left-4 text-4xl opacity-20">🚜</div>
                <div className="absolute top-1/2 right-8 text-3xl opacity-20">📊</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">⭐</span>
              What Farmers Say
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by thousands of farmers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Field-Wise is transforming agriculture and helping farmers achieve better results
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto text-center shadow-lg">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">⭐</span>
                        ))}
                      </div>
                      <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed italic">
                        "{testimonial.text}"
                      </blockquote>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">{testimonial.avatar}</span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-gray-600 text-sm">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">💎</span>
              Simple Pricing
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose the perfect plan for your farm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and scale as you grow. All plans include our core features with varying limits and support levels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative ${plan.color} border-2 rounded-2xl p-8 ${plan.popular ? 'scale-105 shadow-2xl' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 ml-2">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-green-500'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need a custom solution? We're here to help!
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
            >
              Contact our sales team 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to revolutionize your farming?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers who are already using Field-Wise to increase their yield, 
            reduce costs, and make smarter farming decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/crop-health"
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              🔬 Try Free Analysis
            </Link>
            <Link 
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all"
            >
              📊 View Dashboard
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm opacity-80">
            <div>✅ Free to start</div>
            <div>✅ No credit card required</div>
            <div>✅ Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌾</span>
                </div>
                <span className="font-bold text-xl">Field-Wise</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering farmers with AI-driven insights, real-time monitoring, and expert guidance 
                for sustainable and profitable agriculture.
              </p>
              <div className="flex space-x-4">
                {['📧', '🐦', '📘', '📸'].map((icon, index) => (
                  <button key={index} className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/crop-health" className="hover:text-white transition-colors">Crop Analysis</Link></li>
                <li><Link to="/weather" className="hover:text-white transition-colors">Weather Monitoring</Link></li>
                <li><Link to="/network" className="hover:text-white transition-colors">IoT Sensors</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Expert Community</Link></li>
                <li><Link to="/chatbot" className="hover:text-white transition-colors">AI Assistant</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Field-Wise. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
