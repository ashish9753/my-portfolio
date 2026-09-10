import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import LoadingScreen from '../../components/LoadingScreen.jsx';

const API_URL = 'https://dsa-sheet-backend-7r7i.onrender.com/api/questions';
const DEFAULT_QUESTIONS_PER_TOPIC = 2;

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const toStoredQuestion = (question, savedAt = Date.now()) => ({
  id: question._id,
  name: question.name,
  topic: question.topic,
  difficulty: question.difficulty,
  leetcodeLink: question.leetcodeLink || '',
  gfgLink: question.gfgLink || '',
  savedAt
});

function RandomPracticeSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [questionsPerTopic, setQuestionsPerTopic] = useState(DEFAULT_QUESTIONS_PER_TOPIC);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [seenQuestionIds, setSeenQuestionIds] = useState([]);
  const [practicedQuestions, setPracticedQuestions] = useState([]);
  const [isPracticeHistoryOpen, setIsPracticeHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const storageKey = `dsa-random-practice-seen-${auth.user?._id || auth.user?.id || auth.user?.username || 'guest'}`;
  const historyStorageKey = `dsa-random-practice-history-${auth.user?._id || auth.user?.id || auth.user?.username || 'guest'}`;

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const handleAuthError = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null, token: null });
    navigate('/login');
  };

  useEffect(() => {
    try {
      const savedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setSeenQuestionIds(Array.isArray(savedIds) ? savedIds : []);

      const savedHistory = JSON.parse(localStorage.getItem(historyStorageKey) || '[]');
      setPracticedQuestions(
        Array.isArray(savedHistory) ? savedHistory.filter((question) => question?.id && question?.name) : []
      );
    } catch {
      setSeenQuestionIds([]);
      setPracticedQuestions([]);
    }

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(API_URL, getAuthHeaders());
        setAllQuestions(response.data);
      } catch (error) {
        console.error('Error fetching practice questions:', error);
        if (error.response?.status === 401) handleAuthError();
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Upgrade history created before question details were stored locally.
  useEffect(() => {
    if (!allQuestions.length || practicedQuestions.length || !seenQuestionIds.length) return;

    const restoredHistory = seenQuestionIds
      .map((id) => allQuestions.find((question) => question._id === id))
      .filter(Boolean)
      .map(toStoredQuestion);

    if (restoredHistory.length) {
      setPracticedQuestions(restoredHistory);
      localStorage.setItem(historyStorageKey, JSON.stringify(restoredHistory));
    }
  }, [allQuestions, practicedQuestions.length, seenQuestionIds, historyStorageKey]);

  const topics = useMemo(
    () => [...new Set(allQuestions.map((question) => question.topic).filter(Boolean))].sort(),
    [allQuestions]
  );

  const createPracticeSet = () => {
    const activeTopics = selectedTopic === 'all' ? topics : [selectedTopic];
    const seenIds = new Set(seenQuestionIds);
    const nextQuestions = activeTopics.flatMap((topic) => {
      const unseen = allQuestions.filter((question) => question.topic === topic && !seenIds.has(question._id));
      return shuffle(unseen).slice(0, questionsPerTopic);
    });

    setPracticeQuestions(nextQuestions);
    if (nextQuestions.length) {
      const nextSeenIds = [...new Set([...seenQuestionIds, ...nextQuestions.map((question) => question._id)])];
      const savedAt = Date.now();
      const nextHistory = [
        ...nextQuestions.map((question, index) => toStoredQuestion(question, savedAt + index)),
        ...practicedQuestions.filter((question) => !nextQuestions.some((nextQuestion) => nextQuestion._id === question.id))
      ].sort((firstQuestion, secondQuestion) => (secondQuestion.savedAt || 0) - (firstQuestion.savedAt || 0));
      setSeenQuestionIds(nextSeenIds);
      setPracticedQuestions(nextHistory);
      localStorage.setItem(storageKey, JSON.stringify(nextSeenIds));
      localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
    }
  };

  const resetHistory = () => {
    const shouldReset = window.confirm(
      'Do you want to reset your local question history? Previously shown questions may appear again.'
    );

    if (!shouldReset) return;

    localStorage.removeItem(storageKey);
    localStorage.removeItem(historyStorageKey);
    setSeenQuestionIds([]);
    setPracticedQuestions([]);
    setPracticeQuestions([]);
  };

  const removePracticedQuestion = (question) => {
    const shouldRemove = window.confirm(
      `Do you want to remove “${question.name}” from your local practice history? It can appear again in a future set.`
    );

    if (!shouldRemove) return;

    const nextSeenIds = seenQuestionIds.filter((id) => id !== question.id);
    const nextHistory = practicedQuestions.filter((savedQuestion) => savedQuestion.id !== question.id);
    localStorage.setItem(storageKey, JSON.stringify(nextSeenIds));
    localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
    setSeenQuestionIds(nextSeenIds);
    setPracticedQuestions(nextHistory);
    setPracticeQuestions((currentQuestions) => currentQuestions.filter((currentQuestion) => currentQuestion._id !== question.id));
  };

  const selectedTopicCount = selectedTopic === 'all' ? topics.length : 1;
  const availableCount = allQuestions.filter((question) =>
    (selectedTopic === 'all' || question.topic === selectedTopic) && !seenQuestionIds.includes(question._id)
  ).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null, token: null });
    navigate('/login');
  };

  if (loading) return <LoadingScreen message="Preparing your random practice..." />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/sheet" className="text-[#00ff00] hover:text-[#00ff00]/80 transition-colors" aria-label="Back to dashboard">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
              <h1 className="text-2xl font-bold"><span className="text-[#00ff00]">DPP</span> — Daily Practice Program</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-400 hidden sm:inline">{auth.user?.username}</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-bold">Build a practice set</h2>
          <p className="text-gray-400 mt-2">Choose one topic or all topics. Fresh questions are saved locally as soon as they are shown, so they will not repeat next time.</p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-4 mt-6 items-end">
            <label className="block text-sm text-gray-400">Topic
              <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)} className="mt-2 w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00]">
                <option value="all">All topics</option>
                {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </label>
            <label className="block text-sm text-gray-400">Questions per topic
              <select value={questionsPerTopic} onChange={(event) => setQuestionsPerTopic(Number(event.target.value))} className="mt-2 w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff00]">
                {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}
              </select>
            </label>
            <button onClick={createPracticeSet} disabled={!availableCount} className="px-6 py-3 bg-[#00b33c] hover:bg-[#00d94a] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">Get questions</button>
          </div>
          <div className="flex flex-wrap justify-between gap-3 mt-5 text-sm">
            <p className="text-gray-400"><span className="text-[#00ff00] font-semibold">{availableCount}</span> fresh question{availableCount === 1 ? '' : 's'} available across {selectedTopicCount} topic{selectedTopicCount === 1 ? '' : 's'}.</p>
            <button onClick={resetHistory} className="text-gray-400 hover:text-white underline underline-offset-4">Reset local question history</button>
          </div>
        </div>

        {practiceQuestions.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">Your practice set</h2><span className="text-sm text-gray-400">{practiceQuestions.length} question{practiceQuestions.length === 1 ? '' : 's'}</span></div>
            <div className="space-y-3">
              {practiceQuestions.map((question, index) => (
                <article key={question._id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:bg-[#252525] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div><p className="text-xs uppercase tracking-wider text-[#00ff00] mb-1">{question.topic}</p><h3 className="font-medium text-white">{index + 1}. {question.name}</h3></div>
                    <span className={`w-fit text-sm px-3 py-1 rounded-full ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{question.difficulty}</span>
                  </div>
                  <div className="flex space-x-4 mt-3">
                    {question.leetcodeLink && <a href={question.leetcodeLink} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">LeetCode →</a>}
                    {question.gfgLink && <a href={question.gfgLink} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300 transition-colors">GFG →</a>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {practicedQuestions.length > 0 && (
          <section className="mt-10">
            <button
              type="button"
              onClick={() => setIsPracticeHistoryOpen((isOpen) => !isOpen)}
              aria-expanded={isPracticeHistoryOpen}
              className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 hover:border-[#00ff00]/60 transition-colors"
            >
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  Practiced questions
                  <svg className={`w-5 h-5 text-[#00ff00] transition-transform duration-300 ${isPracticeHistoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6" /></svg>
                </h2>
                <p className="text-sm text-gray-400 mt-1">Saved on this device until you remove them or reset the local history.</p>
              </div>
              <span className="text-sm text-[#00ff00]">{practicedQuestions.length} saved · {isPracticeHistoryOpen ? 'Close' : 'Open'}</span>
            </button>
            {isPracticeHistoryOpen && (
            <div className="space-y-3 mt-4">
              {practicedQuestions.map((question) => (
                <article key={question.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#00ff00] mb-1">{question.topic}</p>
                      <h3 className="font-medium text-white">{question.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-fit text-sm px-3 py-1 rounded-full ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{question.difficulty}</span>
                      <button onClick={() => removePracticedQuestion(question)} className="text-sm text-red-400 hover:text-red-300 transition-colors">Remove</button>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-3">
                    {question.leetcodeLink && <a href={question.leetcodeLink} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">LeetCode →</a>}
                    {question.gfgLink && <a href={question.gfgLink} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300 transition-colors">GFG →</a>}
                  </div>
                </article>
              ))}
            </div>
            )}
          </section>
        )}

        {!practiceQuestions.length && !availableCount && (
          <div className="mt-8 text-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-10"><h2 className="text-xl font-semibold">You have seen every available question here.</h2><p className="text-gray-400 mt-2">Reset your local history to start this rotation again.</p></div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default RandomPracticeSheet;
