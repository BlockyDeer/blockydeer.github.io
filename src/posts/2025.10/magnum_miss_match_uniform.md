# Magnum setUniform 设置 Matrix4 失败

我在写一个 Magnum Engine 程序的时候。使用了一个自己的 Shader，我寻思需要设置 MVP 矩阵。

```glsl
uniform mat4 mvp;
```

所以在`CommonShader`类里添加：

```cpp
class CommonShader final : public Magnum::GL::AbstractShaderProgram {
        static constexpr Magnum::Int texture_unit = 0;
        Magnum::Int mvp_uniform;

public:
        using VertexPosition = Magnum::GL::Attribute<0, Magnum::Vector2>;
        using VertexTexCoord = Magnum::GL::Attribute<1, Magnum::Vector2>;

        CommonShader();
        CommonShader &bind_texture(Magnum::GL::Texture2D &texture);
        CommonShader &set_mvp(const Magnum::Matrix4 &mvp);
};

CommonShader &CommonShader::set_mvp(const Magnum::Matrix4 &mvp) {
        setUniform(mvp_uniform, mvp);
        return *this;
}
```

编译器在`setUniform`处报错：

```
/usr/include/Magnum/GL/AbstractShaderProgram.h:1635:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Float' (aka 'float') for 2nd argument
 1635 |         void setUniform(Int location, Float value);
      |              ^                        ~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1636:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<2, Float>' (aka 'const Vector<2, float>') for 2nd argument
 1636 |         void setUniform(Int location, const Math::Vector<2, Float>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1637:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<3, Float>' (aka 'const Vector<3, float>') for 2nd argument
 1637 |         void setUniform(Int location, const Math::Vector<3, Float>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1638:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<4, Float>' (aka 'const Vector<4, float>') for 2nd argument
 1638 |         void setUniform(Int location, const Math::Vector<4, Float>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1653:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Int' (aka 'int') for 2nd argument
 1653 |         void setUniform(Int location, Int value); /**< @overload */
      |              ^                        ~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1654:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<2, Int>' (aka 'const Vector<2, int>') for 2nd argument
 1654 |         void setUniform(Int location, const Math::Vector<2, Int>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1655:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<3, Int>' (aka 'const Vector<3, int>') for 2nd argument
 1655 |         void setUniform(Int location, const Math::Vector<3, Int>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1656:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<4, Int>' (aka 'const Vector<4, int>') for 2nd argument
 1656 |         void setUniform(Int location, const Math::Vector<4, Int>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1675:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'UnsignedInt' (aka 'unsigned int') for 2nd argument
 1675 |         void setUniform(Int location, UnsignedInt value);
      |              ^                        ~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1676:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<2, UnsignedInt>' (aka 'const Vector<2, unsigned int>') for 2nd argument
 1676 |         void setUniform(Int location, const Math::Vector<2, UnsignedInt>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1677:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<3, UnsignedInt>' (aka 'const Vector<3, unsigned int>') for 2nd argument
 1677 |         void setUniform(Int location, const Math::Vector<3, UnsignedInt>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1678:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<4, UnsignedInt>' (aka 'const Vector<4, unsigned int>') for 2nd argument
 1678 |         void setUniform(Int location, const Math::Vector<4, UnsignedInt>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1697:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Double' (aka 'double') for 2nd argument
 1697 |         void setUniform(Int location, Double value);
      |              ^                        ~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1698:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<2, Double>' (aka 'const Vector<2, double>') for 2nd argument
 1698 |         void setUniform(Int location, const Math::Vector<2, Double>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1699:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<3, Double>' (aka 'const Vector<3, double>') for 2nd argument
 1699 |         void setUniform(Int location, const Math::Vector<3, Double>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1700:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'const Math::Vector<4, Double>' (aka 'const Vector<4, double>') for 2nd argument
 1700 |         void setUniform(Int location, const Math::Vector<4, Double>& value); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1716:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Float>' (aka 'ArrayView<const float>') for 2nd argument
 1716 |         void setUniform(Int location, Containers::ArrayView<const Float> values);
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1717:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<2, Float>>' (aka 'ArrayView<const Vector<2, float>>') for 2nd argument
 1717 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<2, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1718:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<3, Float>>' (aka 'ArrayView<const Vector<3, float>>') for 2nd argument
 1718 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<3, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1719:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<4, Float>>' (aka 'ArrayView<const Vector<4, float>>') for 2nd argument
 1719 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<4, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1734:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Int>' (aka 'ArrayView<const int>') for 2nd argument
 1734 |         void setUniform(Int location, Containers::ArrayView<const Int> values);
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1735:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<2, Int>>' (aka 'ArrayView<const Vector<2, int>>') for 2nd argument
 1735 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<2, Int>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1736:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<3, Int>>' (aka 'ArrayView<const Vector<3, int>>') for 2nd argument
 1736 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<3, Int>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1737:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<4, Int>>' (aka 'ArrayView<const Vector<4, int>>') for 2nd argument
 1737 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<4, Int>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1756:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const UnsignedInt>' (aka 'ArrayView<const unsigned int>') for 2nd argument
 1756 |         void setUniform(Int location, Containers::ArrayView<const UnsignedInt> values);
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1757:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<2, UnsignedInt>>' (aka 'ArrayView<const Vector<2, unsigned int>>') for 2nd argument
 1757 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<2, UnsignedInt>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1758:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<3, UnsignedInt>>' (aka 'ArrayView<const Vector<3, unsigned int>>') for 2nd argument
 1758 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<3, UnsignedInt>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1759:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<4, UnsignedInt>>' (aka 'ArrayView<const Vector<4, unsigned int>>') for 2nd argument
 1759 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<4, UnsignedInt>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1778:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Double>' (aka 'ArrayView<const double>') for 2nd argument
 1778 |         void setUniform(Int location, Containers::ArrayView<const Double> values);
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1779:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<2, Double>>' (aka 'ArrayView<const Vector<2, double>>') for 2nd argument
 1779 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<2, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1780:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<3, Double>>' (aka 'ArrayView<const Vector<3, double>>') for 2nd argument
 1780 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<3, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1781:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::Vector<4, Double>>' (aka 'ArrayView<const Vector<4, double>>') for 2nd argument
 1781 |         void setUniform(Int location, Containers::ArrayView<const Math::Vector<4, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1819:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<2, 2, Float>>' (aka 'ArrayView<const RectangularMatrix<2, 2, float>>') for 2nd argument
 1819 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<2, 2, Float>> values);
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1820:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<3, 3, Float>>' (aka 'ArrayView<const RectangularMatrix<3, 3, float>>') for 2nd argument
 1820 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<3, 3, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1821:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<4, 4, Float>>' (aka 'ArrayView<const RectangularMatrix<4, 4, float>>') for 2nd argument
 1821 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<4, 4, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1839:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<2, 3, Float>>' (aka 'ArrayView<const RectangularMatrix<2, 3, float>>') for 2nd argument
 1839 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<2, 3, Float>> values);
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1840:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<3, 2, Float>>' (aka 'ArrayView<const RectangularMatrix<3, 2, float>>') for 2nd argument
 1840 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<3, 2, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1841:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<2, 4, Float>>' (aka 'ArrayView<const RectangularMatrix<2, 4, float>>') for 2nd argument
 1841 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<2, 4, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1842:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<4, 2, Float>>' (aka 'ArrayView<const RectangularMatrix<4, 2, float>>') for 2nd argument
 1842 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<4, 2, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1843:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<3, 4, Float>>' (aka 'ArrayView<const RectangularMatrix<3, 4, float>>') for 2nd argument
 1843 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<3, 4, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1844:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<4, 3, Float>>' (aka 'ArrayView<const RectangularMatrix<4, 3, float>>') for 2nd argument
 1844 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<4, 3, Float>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1863:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<2, 2, Double>>' (aka 'ArrayView<const RectangularMatrix<2, 2, double>>') for 2nd argument
 1863 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<2, 2, Double>> values);
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1864:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<3, 3, Double>>' (aka 'ArrayView<const RectangularMatrix<3, 3, double>>') for 2nd argument
 1864 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<3, 3, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1865:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<4, 4, Double>>' (aka 'ArrayView<const RectangularMatrix<4, 4, double>>') for 2nd argument
 1865 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<4, 4, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1866:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<2, 3, Double>>' (aka 'ArrayView<const RectangularMatrix<2, 3, double>>') for 2nd argument
 1866 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<2, 3, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1867:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<3, 2, Double>>' (aka 'ArrayView<const RectangularMatrix<3, 2, double>>') for 2nd argument
 1867 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<3, 2, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1868:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<2, 4, Double>>' (aka 'ArrayView<const RectangularMatrix<2, 4, double>>') for 2nd argument
 1868 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<2, 4, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1869:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<4, 2, Double>>' (aka 'ArrayView<const RectangularMatrix<4, 2, double>>') for 2nd argument
 1869 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<4, 2, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1870:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<3, 4, Double>>' (aka 'ArrayView<const RectangularMatrix<3, 4, double>>') for 2nd argument
 1870 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<3, 4, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1871:14: note: candidate function not viable: cannot convert argument of incomplete type 'const Magnum::Matrix4' (aka 'const Matrix4<float>') to 'Containers::ArrayView<const Math::RectangularMatrix<4, 3, Double>>' (aka 'ArrayView<const RectangularMatrix<4, 3, double>>') for 2nd argument
 1871 |         void setUniform(Int location, Containers::ArrayView<const Math::RectangularMatrix<4, 3, Double>> values); /**< @overload */
      |              ^                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/usr/include/Magnum/GL/AbstractShaderProgram.h:1802:68: note: candidate template ignored: could not match 'Math::RectangularMatrix' against 'Magnum::Matrix4'
 1802 |         template<std::size_t cols, std::size_t rows, class T> void setUniform(Int location, const Math::RectangularMatrix<cols, rows, T>& value) {
      |                                                                    ^
2 warnings and 1 error generated.
```

重点在于最后一个，类型`Magnum::Matrix4`居然无法匹配`Magnum::Math::RectangularMatrix`

翻文档也好，翻头文件也好，我看到`Magnum::Matrix4`是`Magnum::Math::Matrix4<float>`的一个别名：

```cpp
/**
@brief 4x4 float transformation matrix

Equivalent to GLSL @glsl mat4 @ce.
@see @ref Matrix4x4
@m_keyword{mat4,GLSL mat4,}
*/
typedef Math::Matrix4<Float> Matrix4;
```

而`Magnum::Math::Matrix4<T>`继承自`Magnum::Math::Matrix4x4<T>`。

```cpp
template<class T>
class Matrix4: public Matrix4x4<T>
```

`Magnum::Math::Matrix4x4<T>`是`Magnum::Math::Matrix<4, T>`的别名：

```cpp
template<class T>
using Matrix4x4 = Matrix<4, T>;
```

`Magnum::Math::Matrix4x4<size, T>`继承自`Magnum::Math::RectangularMatrix<size, size, T>`：

```cpp
template<std::size_t size, class T>
class Matrix: public RectangularMatrix<size, size, T>
```

看上去应该正确匹配不是？Magnum给出的例子也是这样做的，但是为什么人家能编译但是我不行呢？

在濒临崩溃之际，我`#include`了：

```cpp
#include <Magnum/Math/Matrix4.h>
```

结果编译通过了……