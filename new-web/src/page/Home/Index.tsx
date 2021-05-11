import { useState, useEffect } from 'react';
import './Index.scss';
import Footer from '../../common/lib/Footer';

interface imgItem {
  id: string;
  text: string;
  imgStyle?: { [key: string]: string };
}

const originImgs: imgItem[] = [
  {
    id: 'first',
    text: 'IV',
  },
  {
    id: 'second',
    text: 'HUSH',
  },
  {
    id: 'third',
    text: 'OHIO',
  },
  {
    id: 'forth',
    text: 'MYTH',
  },
];

function Home(): JSX.Element {
  const [bgStyle, setBgStyle] = useState<{ height: string }>({
    height: document.documentElement.clientHeight + 'px',
  });

  const [imgs, setImgs] = useState<imgItem[]>([]);

  useEffect(() => {
    setBgStyle({
      height: document.documentElement.clientHeight + 'px',
    });
    const imgPromises: Promise<imgItem>[] = originImgs.map(async (item) => {
      return import('../../static/img/img' + Math.floor(Math.random() * 20 + 1) + '.jpg').then((res) => {
        return {
          ...item,
          imgStyle: {
            height: document.documentElement.clientHeight + 'px',
            backgroundImage: `url(${res.default})`,
            backgroundSize: 'cover',
          },
        };
      });
    });
    Promise.all(imgPromises).then((imgs) => {
      setImgs(imgs);
    });
  }, []);

  return (
    <div className="home-page">
      {imgs.map((item, i) => {
        return (
          <div key={i} id={item.id + 'Page'} className={'index-bg ' + item.id} style={bgStyle}>
            <div className="img" style={item.imgStyle}></div>
            <div className="mask" style={bgStyle}>
              {item.text}
              {i === 3 && <Footer />}
            </div>
            {/* { i === 0 &&
          <ul className="nav-ul">
            <li><RouteLink to="/photograph">摄影</RouteLink></li>
            <li><RouteLink to="/articles">博客</RouteLink></li>
          </ul>
           } */}
          </div>
        );
      })}
    </div>
  );
}

export default Home;
